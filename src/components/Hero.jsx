import { useState, useMemo } from 'react'
import Editor from 'react-simple-code-editor'
import Prism from 'prismjs'
import azoraDef from '../data/azora-prism'

azoraDef(Prism)

const defaultCode = `module playground

use std.container.tuple

use zone std

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
    println(tupleOf(app.greet(), ":)"))
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
  background: 'transparent',
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
    <>
      <style>{tokenCSS}</style>
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero__media" aria-hidden="true" />
        <div className="hero__veil" aria-hidden="true" />
        <div className="hero__content page-shell" data-reveal>
          <h1 id="hero-title">Azora</h1>
          <p className="hero__statement">
            <span>Fast.</span> <span>Safe.</span> Expressive.
          </p>
          <p className="hero__copy">
            A modern systems language with real-time IR generation and one source of truth for LLVM, JavaScript, WebAssembly, and direct interpretation.
          </p>
          <div className="hero__actions">
            <a className="button button--primary" href="https://code.azoralang.org" target="_blank" rel="noopener noreferrer">
              Try Azora
              <span aria-hidden="true">↗</span>
            </a>
            <a className="button button--glass" href="https://book.azoralang.org" target="_blank" rel="noopener noreferrer">
              Read the Book
            </a>
          </div>
          <div className="hero__targets" aria-label="Supported compilation targets">
            <span>Interpreter</span>
            <span>LLVM</span>
            <span>JavaScript</span>
            <span>WebAssembly</span>
          </div>
        </div>
        <a className="hero__scroll" href="#runtime">
          Live runtime <span aria-hidden="true">↓</span>
        </a>
      </section>

      <section id="runtime" className="runtime section-band">
        <div className="page-shell">
          <div className="section-heading section-heading--split" data-reveal>
            <div>
              <span className="section-kicker">In the browser</span>
              <h2>Code that is already alive.</h2>
            </div>
            <p>Edit the source, run it through Azora's interpreter, and see the result without leaving the page.</p>
          </div>

          <div className="runtime__frame glass-panel" data-reveal="up">
            <div className="runtime__toolbar">
              <div className="runtime__file">
                <span className="runtime__status" aria-hidden="true" />
                <span>Main.az</span>
              </div>
              <div className="runtime__actions">
                {engine.loading && (
                  <span className="runtime__message"><Spinner /> Loading runtime</span>
                )}
                {engine.error && <span className="runtime__message runtime__message--error">Engine error</span>}
                {hasMain && (
                  <button className="icon-command icon-command--run" onClick={handleRun} disabled={!engine.ready || running}>
                    {runningMode === 'run' ? <><Spinner /> Running</> : <><PlayIcon /> Run</>}
                  </button>
                )}
                {hasTests && (
                  <button className="icon-command" onClick={handleRunTests} disabled={!engine.ready || running}>
                    {runningMode === 'test' ? <><Spinner /> Testing</> : <><CheckIcon /> Test</>}
                  </button>
                )}
              </div>
            </div>
            <div className="az-editor runtime__editor">
              <Editor
                value={code}
                onValueChange={setCode}
                highlight={highlightCode}
                padding={24}
                style={{ ...editorStyle, minHeight: '100%' }}
                tabSize={4}
                insertSpaces
              />
            </div>
            {output && (
              <div className="runtime__output">
                <div>Output</div>
                {output.success ? (
                  <pre>{output.output || '(no output)'}</pre>
                ) : (
                  <pre className="runtime__output-error">{output.errors}</pre>
                )}
              </div>
            )}
          </div>
          <p className="runtime__note" data-reveal>
            Experimental release. Azora is evolving quickly and is not yet recommended for production systems.
          </p>
        </div>
      </section>
    </>
  )
}
