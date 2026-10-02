import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import vm from 'node:vm'
import { StringStream } from '@codemirror/language'
import { azoraLanguage } from '../src/codemirror/azora-language.js'
import { restoreProject } from '../src/engine/projectStorage.js'

test('saved greeting is migrated without resetting user edits', () => {
  const source = 'impl Language { func greeting[self: Self&](): String { return "custom" } }\n// keep my work'
  const stored = { 'main.az': source, 'language_test.az': 'test "my test" {}' }
  const result = restoreProject({ 'main.az': '', 'language_test.az': '' }, {
    getItem: () => JSON.stringify(stored),
  })
  assert.equal(result['main.az'], source.replace('func greeting[self: Self&]()', 'func &.greeting()'))
  assert.equal(result['language_test.az'], stored['language_test.az'])
})

test('corrupt saved data restores the starter project', () => {
  const initial = { 'main.az': 'func main() {}' }
  assert.deepEqual(restoreProject(initial, { getItem: () => '{broken' }), initial)
})

test('the editor can color keywords and strings before AZLS is available', () => {
  const parser = azoraLanguage().streamParser
  const stream = new StringStream('func &.greeting(): String { return "hello" }', 4)
  const state = parser.startState()
  const tokens = []
  while (!stream.eol()) {
    stream.start = stream.pos
    const kind = parser.token(stream, state)
    assert.ok(stream.pos > stream.start)
    tokens.push([stream.current(), kind])
  }
  assert.ok(tokens.some(([text, kind]) => text === 'func' && kind === 'keyword'))
  assert.ok(tokens.some(([text, kind]) => text.includes('hello') && kind === 'string'))
})

async function runtimeHarness(onAppend, timeout = 30000) {
  const source = (await readFile(new URL('../src/engine/wasmLoader.js', import.meta.url), 'utf8'))
    .replaceAll('export ', '').replaceAll('import.meta.env.BASE_URL', "'/'")
  let loads = 0
  const context = vm.createContext({
    WebAssembly,
    setTimeout: (callback, delay) => setTimeout(callback, delay === 30000 ? timeout : delay),
    clearTimeout,
    document: {
      querySelector: () => null,
      createElement: () => ({ setAttribute() {} }),
      head: { appendChild(script) { loads++; onAppend(script, context) } },
    },
  })
  vm.runInContext(source, context)
  return { load: context.loadWasmEngine, loads: () => loads }
}

const exports = { azInterpret: async () => '{"success":true,"output":"hello"}', azPreprocess: () => '{"success":true}' }

test('concurrent runtime loads share one compiler initialization', async () => {
  const harness = await runtimeHarness((script, context) => {
    context.compiler = Promise.resolve(exports)
    queueMicrotask(() => script.onload())
  })
  const first = harness.load('0.1-dev')
  assert.equal(harness.load('0.1-dev'), first)
  const engine = await first
  assert.equal(harness.loads(), 1)
  assert.equal((await engine.interpret('func main() {}')).output, 'hello')
})

test('initialization errors remain visible and a retry can recover', async () => {
  let fail = true
  const harness = await runtimeHarness((script, context) => {
    context.compiler = fail ? Promise.reject(new Error('unsupported wasm feature')) : Promise.resolve(exports)
    script.onload()
  })
  await assert.rejects(harness.load('0.1-dev'), /unsupported wasm feature/)
  fail = false
  const engine = await harness.load('0.1-dev')
  assert.equal((await engine.interpret('')).success, true)
  assert.equal(harness.loads(), 2)
})

test('an unresolved compiler reports a timeout rather than hanging', async () => {
  const harness = await runtimeHarness((script, context) => {
    context.compiler = new Promise(() => {})
    script.onload()
  }, 10)
  await assert.rejects(harness.load('0.1-dev'), /initialization timed out/)
})
