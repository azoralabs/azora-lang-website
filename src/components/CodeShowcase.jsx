import { useState, useMemo } from 'react'
import Prism from 'prismjs'
import azoraDef from '../data/azora-prism'
import { codeExamples } from '../data/codeExamples'

azoraDef(Prism)

const tokenCSS = `
.az-showcase .token.keyword { color: #D16B8E; font-weight: bold; }
.az-showcase .token.boolean, .az-showcase .token.null-literal { color: #D16B8E; font-weight: bold; }
.az-showcase .token.class-name, .az-showcase .token.type-keyword, .az-showcase .token.type-name { color: #5FA89F; }
.az-showcase .token.builtin, .az-showcase .token.builtin-fn, .az-showcase .token.function { color: #D4A574; }
.az-showcase .token.string { color: #7DBF8A; }
.az-showcase .token.number { color: #ECECEC; }
.az-showcase .token.comment { color: #676767; font-style: italic; }
.az-showcase .token.doc-comment { color: #6B9F77; font-style: italic; }
.az-showcase .token.doc-tag { color: #5BA3D0; font-weight: bold; }
.az-showcase .token.annotation, .az-showcase .token.decorator { color: #E6C96B; }
.az-showcase .token.variable, .az-showcase .token.preprocessor { color: #B06FA8; font-style: italic; }
.az-showcase .token.interpolation { color: #D9D9D9; }
.az-showcase .token.interpolation-punctuation { color: #E6C96B; }
.az-showcase .token.operator { color: #B2B3B3; }
.az-showcase .token.punctuation { color: #B2B3B3; }
`

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

function highlightCode(code) {
  return Prism.highlight(code, Prism.languages.azora, 'azora')
}

export default function CodeShowcase({ engine }) {
  const [selected, setSelected] = useState(0)
  const [output, setOutput] = useState(null)
  const [runningMode, setRunningMode] = useState(null)
  const example = codeExamples[selected]

  const { hasMain, hasTests } = useMemo(() => detectCapabilities(example.code), [example.code])
  const highlighted = useMemo(() => highlightCode(example.code), [example.code])
  const running = runningMode !== null

  function handleSelect(i) {
    setSelected(i)
    setOutput(null)
  }

  async function handleRun() {
    if (!engine.ready || running) return
    setRunningMode('run')
    setOutput(null)
    const result = await engine.interpret(example.code)
    setOutput(result)
    setRunningMode(null)
  }

  async function handleRunTests() {
    if (!engine.ready || running) return
    setRunningMode('test')
    setOutput(null)
    const result = await engine.runTests(example.code)
    setOutput(result)
    setRunningMode(null)
  }

  return (
    <section id="examples" className="showcase section-band">
      <style>{tokenCSS}</style>
      <div className="page-shell page-shell--narrow">
        <div className="section-heading section-heading--split" data-reveal>
          <div>
            <span className="section-kicker">Language tour</span>
            <h2>Read Azora by example.</h2>
          </div>
          <p>Move through real language features, inspect the syntax, and execute supported examples directly.</p>
        </div>

        <div className="showcase__controls" data-reveal>
          <div className="glass-select-wrap">
            <select
              value={selected}
              onChange={e => handleSelect(Number(e.target.value))}
              className="glass-select"
              aria-label="Choose a code example"
            >
              {codeExamples.map((ex, i) => (
                <option key={i} value={i}>{ex.title}</option>
              ))}
            </select>
          </div>
          <a
            href="https://code.azoralang.org"
            target="_blank"
            rel="noopener noreferrer"
            className="button button--glass button--compact"
          >
            Open in Playground
            <span aria-hidden="true">↗</span>
          </a>
        </div>

        <div className="showcase__frame glass-panel" data-reveal="up">
          <div className="runtime__toolbar">
            <div className="runtime__file">
              <span className="runtime__status" aria-hidden="true" />
              <span>{example.title.replace(/[^a-zA-Z0-9]+/g, '')}.az</span>
            </div>
            <div className="runtime__actions">
              {engine.loading && (
                <span className="runtime__message"><Spinner /> Loading runtime</span>
              )}
              {engine.error && (
                <span className="runtime__message runtime__message--error">Engine error</span>
              )}
              {hasMain && (
                <button
                  onClick={handleRun}
                  disabled={!engine.ready || running}
                  className="icon-command icon-command--run"
                >
                  {runningMode === 'run' ? <><Spinner /> Running</> : <><PlayIcon /> Run</>}
                </button>
              )}
              {hasTests && (
                <button
                  onClick={handleRunTests}
                  disabled={!engine.ready || running}
                  className="icon-command"
                >
                  {runningMode === 'test' ? <><Spinner /> Running Tests</> : <><CheckIcon /> Run Tests</>}
                </button>
              )}
            </div>
          </div>
          <pre
            className="az-showcase showcase__code"
            style={{
              background: 'transparent',
              padding: '1.25rem',
              margin: 0,
              fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', Consolas, monospace",
              fontSize: '0.875rem',
              lineHeight: '1.6',
              color: '#D9D9D9',
            }}
          >
            <code dangerouslySetInnerHTML={{ __html: highlighted }} />
          </pre>
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
      </div>
    </section>
  )
}
