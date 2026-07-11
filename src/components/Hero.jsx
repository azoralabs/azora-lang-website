import { useState, useMemo } from 'react'
import Editor from 'react-simple-code-editor'
import Prism from 'prismjs'
import azoraDef from '../data/azora-prism'

azoraDef(Prism)

const defaultCode = `package playground

pack App {
    var name: String
}

impl App {
    func greet(): String { ref self ->
        return "Hello from \${self.name}!"
    }
}

func main() {
    fin app = App("Azora")
    println(app.greet())
}`

const PlayIcon = () => (
  <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
    <path d="M4 2l10 6-10 6V2z" />
  </svg>
)

const CheckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 8l4 4L14 4" />
  </svg>
)

const Spinner = () => (
  <svg className="animate-spin w-3 h-3" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="8" cy="8" r="6" strokeOpacity="0.3" />
    <path d="M8 2a6 6 0 0 1 6 6" />
  </svg>
)

function detectCapabilities(code) {
  const hasMain = /\bfunc\s+main\s*\(/.test(code) || /\btask\s+main\s*\(/.test(code) || /\bhook\s+onStart\s*\(/.test(code)
  const hasTests = /\btest\s+"/.test(code)
  return { hasMain, hasTests }
}

const tokenCSS = `
.az-editor .token.keyword { color: #D16B8E; font-weight: bold; }
.az-editor .token.boolean, .az-editor .token.null-literal { color: #D16B8E; font-weight: bold; }
.az-editor .token.class-name, .az-editor .token.type-keyword, .az-editor .token.type-name { color: #5FA89F; }
.az-editor .token.builtin, .az-editor .token.builtin-fn, .az-editor .token.function { color: #D4A574; }
.az-editor .token.string { color: #7DBF8A; }
.az-editor .token.number { color: #ECECEC; }
.az-editor .token.comment { color: #676767; font-style: italic; }
.az-editor .token.doc-comment { color: #6B9F77; font-style: italic; }
.az-editor .token.doc-tag { color: #5BA3D0; font-weight: bold; }
.az-editor .token.doc-param-name { color: #D9D9D9; }
.az-editor .token.annotation, .az-editor .token.decorator { color: #E6C96B; }
.az-editor .token.variable, .az-editor .token.preprocessor { color: #B06FA8; font-style: italic; }
.az-editor .token.interpolation { color: #D9D9D9; }
.az-editor .token.interpolation-punctuation { color: #E6C96B; }
.az-editor .token.operator { color: #B2B3B3; }
.az-editor .token.punctuation { color: #B2B3B3; }
`

const editorStyle = {
  fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', Consolas, monospace",
  fontSize: '0.85rem',
  lineHeight: '1.6',
  background: '#141414',
  color: '#D9D9D9',
  caretColor: '#D9D9D9',
  minHeight: '12rem',
}

export default function Hero({ engine }) {
  const [code, setCode] = useState(defaultCode)
  const [output, setOutput] = useState(null)
  const [runningMode, setRunningMode] = useState(null)

  const { hasMain, hasTests } = useMemo(() => detectCapabilities(code), [code])
  const running = runningMode !== null

  function highlightCode(code) {
    return Prism.highlight(code, Prism.languages.azora, 'azora')
  }

  async function handleRun() {
    if (!engine.ready || running) return
    setRunningMode('run')
    setOutput(null)
    const result = await engine.interpret(code)
    setOutput(result)
    setRunningMode(null)
  }

  async function handleRunTests() {
    if (!engine.ready || running) return
    setRunningMode('test')
    setOutput(null)
    const result = await engine.runTests(code)
    setOutput(result)
    setRunningMode(null)
  }

  return (
    <section className="pt-28 pb-20 px-4">
      <style>{tokenCSS}</style>
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-start">
        <div className="pt-16">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">

            <span className="text-az-primary">Fast.</span>{' '}
            <span className="text-az-secondary">Safe.</span>{' '}
            Expressive.
          </h1>
          <p className="text-lg text-az-40 mb-8 max-w-xl">
            Azora is a modern general purpose programming language with real-time IR generation. No build step. Just code and run, interpreted or compiled to LLVM, JavaScript, and WebAssembly from a single language.
            <span className="block mt-4">Azora is experimental and in early stages of development. Not recommended for production use.</span>
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="https://code.azoralang.org"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-az-primary text-white font-medium hover:brightness-110 transition"
            >
              Try in Playground
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 3l6 5-6 5" />
              </svg>
            </a>
            <a
              href="https://book.azoralang.org"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-az-65 text-az-20 font-medium hover:border-az-40 hover:text-az-10 transition"
            >
              Read the Book
            </a>
          </div>
        </div>

        <div className="rounded-xl border border-az-75 overflow-hidden bg-az-95 flex flex-col">
          <div className="flex items-center justify-between px-4 py-2.5 bg-az-85 border-b border-az-75 shrink-0">
            <span className="text-xs text-az-60 font-mono">Main.az</span>
            <div className="flex items-center gap-2">
              {engine.loading && (
                <span className="inline-flex items-center gap-1.5 text-xs text-az-50"><Spinner /> Loading...</span>
              )}
              {hasMain && (
                <button
                  onClick={handleRun}
                  disabled={!engine.ready || running}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium bg-az-green/15 text-az-green hover:bg-az-green/25 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  {runningMode === 'run' ? <><Spinner /> Running</> : <><PlayIcon /> Run</>}
                </button>
              )}
              {hasTests && (
                <button
                  onClick={handleRunTests}
                  disabled={!engine.ready || running}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium bg-az-secondary/15 text-az-secondary hover:bg-az-secondary/25 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  {runningMode === 'test' ? <><Spinner /> Running Tests</> : <><CheckIcon /> Run Tests</>}
                </button>
              )}
            </div>
          </div>
          <div className="az-editor overflow-auto" style={{ height: '24rem' }}>
            <Editor
              value={code}
              onValueChange={setCode}
              highlight={highlightCode}
              padding={20}
              style={{ ...editorStyle, minHeight: '100%' }}
              tabSize={4}
              insertSpaces
            />
          </div>
          {output && (
            <div className="border-t border-az-75 px-4 py-3 bg-az-95 font-mono text-xs overflow-auto" style={{ maxHeight: '8rem' }}>
              <div className="text-az-60 mb-1">Output</div>
              {output.success ? (
                <pre className="text-az-green whitespace-pre-wrap">{output.output || '(no output)'}</pre>
              ) : (
                <pre className="text-az-red whitespace-pre-wrap">{output.errors}</pre>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
