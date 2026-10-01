#!/usr/bin/env node
/**
 * Type-check (and optionally run) every Azora snippet azoralang.org shows.
 *
 * The showcase and the hero editor are the site's first impression, so a
 * snippet the current compiler rejects is a broken one. This hands each
 * snippet to the real compiler and reports the ones that fail.
 *
 *   node scripts/check-examples.mjs          check only
 *   node scripts/check-examples.mjs --run    also run main() and test blocks
 *
 * AZORA_BIN overrides the compiler path.
 */
import { promises as fs } from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { fileURLToPath } from 'node:url'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'

const exec = promisify(execFile)
const here = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(here, '..')
const alsoRun = process.argv.includes('--run')

const AZORA = process.env.AZORA_BIN
  || path.resolve(root, '..', 'azora-lang', 'app', 'build', 'install', 'azora', 'bin', 'azora')

/** The data files escape `${` and backticks so the template literals survive. */
const unescape = (code) => code
  .replace(/\\\$\{/g, '${')
  .replace(/\\`/g, '`')
  .replace(/\\\\/g, '\\')

/** Showcase entries: `title: '…'` followed by `code: \`…\``. */
function showcase(source) {
  const out = []
  const re = /title:\s*'((?:[^'\\]|\\.)*)'[\s\S]*?code:\s*`((?:[^`\\]|\\.)*)`/g
  let m
  while ((m = re.exec(source))) out.push({ title: m[1].replace(/\\'/g, "'"), code: m[2] })
  return out
}

/** The hero editor's `initialFiles`: `'name.az': \`…\``. */
function heroFiles(source) {
  const start = source.indexOf('const initialFiles = {')
  if (start < 0) return []
  const out = []
  // A file's source sits in a template literal, so its own braces never end
  // the scan; only the `'name.az': \`` keys are matched.
  const re = /'([^']+\.az)':\s*`((?:[^`\\]|\\.)*)`/g
  re.lastIndex = start
  let m
  while ((m = re.exec(source))) out.push({ title: `Hero ${m[1]}`, code: m[2] })
  return out
}

const SOURCES = [
  ['src/data/codeExamples.js', showcase],
  ['src/components/Hero.jsx', heroFiles],
]

const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'azsite-'))
let checked = 0
let ran = 0
const failures = []

async function compiler(args) {
  try {
    await exec(AZORA, args, { timeout: 180000 })
    return null
  } catch (error) {
    return `${error.stdout || ''}${error.stderr || ''}`.trim().split('\n').slice(0, 4).join('\n')
  }
}

for (const [rel, extract] of SOURCES) {
  const source = await fs.readFile(path.join(root, rel), 'utf8').catch(() => null)
  if (!source) { console.warn(`  skip ${rel} (missing)`); continue }
  const found = extract(source)
  if (!found.length) failures.push({ rel, title: '(none)', stage: 'scan', message: 'no snippets found' })

  for (const { title, code } of found) {
    const program = unescape(code).trim()
    const slug = title.replace(/[^A-Za-z0-9]+/g, '-').toLowerCase()
    const onDisk = path.join(tmp, `${slug}.az`)
    await fs.writeFile(onDisk, program + '\n')

    checked += 1
    const checkError = await compiler(['check', onDisk])
    if (checkError) { failures.push({ rel, title, stage: 'check', message: checkError }); continue }
    if (!alsoRun) continue

    if (/\bfunc\s+main\s*\(/.test(program)) {
      ran += 1
      const runError = await compiler(['run', onDisk])
      if (runError) failures.push({ rel, title, stage: 'run', message: runError })
    }
    if (/\btest(?:\s+\.All)?\s+"/.test(program)) {
      ran += 1
      const testError = await compiler(['test', onDisk])
      if (testError) failures.push({ rel, title, stage: 'test', message: testError })
    }
  }
}

console.log(`${checked} snippets checked${alsoRun ? `, ${ran} run` : ''}`)
if (failures.length) {
  console.error(`\n${failures.length} failing:\n`)
  for (const f of failures) {
    console.error(`  [${f.stage}] ${f.title}  (${f.rel})`)
    console.error(f.message.split('\n').map((l) => `      ${l}`).join('\n'))
    console.error('')
  }
  process.exit(1)
}
console.log('every snippet compiles')
