import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import { ArrowRight, BookOpen, Bug, MoreHorizontal, Play, RotateCcw, Sparkles } from 'lucide-react'
import useAzoraLanguageServer from '../hooks/useAzoraLanguageServer.js'
import { parseCompilerDiagnostics } from '../engine/compilerDiagnostics.js'

const MiniCodeEditor = lazy(() => import('./MiniCodeEditor.jsx'))
const PROJECT_STORAGE_KEY = 'azora-lang-moonlit-project-v3'

const initialFiles = {
  'main.az': `module playground

import std.io

pack Language {
    fin name: String
    fin version: String
}

impl Language {
    func greeting[self: Self&](): String {
        return "Hello from \${self.name} \${self.version}!"
    }
}

func main() {
    fin language = Language("Azora", "v0.0.5")
    std::println(language.greeting())
}`,
  'language_test.az': `module playground.tests

test "language identity" {
    fin name = "Azora"
    assert name == "Azora" { "language name must be stable" }
}`,
}

const fileTree = [{ folder: null, files: ['main.az', 'language_test.az'] }]

const Spinner = () => (
  <svg className="animate-spin w-3 h-3" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <circle cx="8" cy="8" r="6" strokeOpacity="0.3" />
    <path d="M8 2a6 6 0 0 1 6 6" />
  </svg>
)

function loadProject() {
  try {
    const stored = JSON.parse(window.localStorage.getItem(PROJECT_STORAGE_KEY))
    if (stored && typeof stored === 'object') {
      return Object.fromEntries(Object.entries(initialFiles).map(([path, source]) => [
        path,
        typeof stored[path] === 'string' ? stored[path] : source,
      ]))
    }
  } catch {}
  return initialFiles
}

function detectCapabilities(code) {
  const hasMain = /\bfunc\s+main\s*\(/.test(code) || /\btask\s+main\s*\(/.test(code) || /\bhook\s+onStart\s*\(/.test(code)
  const hasTests = /\btest(?:\s+\.All)?\s+"/.test(code)
  return { hasMain, hasTests }
}

function shortName(path) {
  return path.slice(path.lastIndexOf('/') + 1)
}

const tokenCSS = `
.az-editor .token.keyword { color: #D16B8E; font-weight: bold; }
.az-editor .token.boolean, .az-editor .token.null-literal { color: #D16B8E; font-weight: bold; }
.az-editor .token.class-name, .az-editor .token.type-keyword, .az-editor .token.type-name { color: #5FA89F; }
.az-editor .token.spec-type { color: #5FA89F; font-style: italic; }
.az-editor .token.zone, .az-editor .token.module-path { color: #D9DADA; font-style: italic; }
.az-editor .token.generic { color: #5BA3D0; font-weight: bold; }
.az-editor .token.builtin, .az-editor .token.builtin-fn, .az-editor .token.function { color: #E6C96B; }
.az-editor .token.spec-function { color: #E6C96B; font-style: italic; }
.az-editor .token.override-function { color: #E6C96B; font-style: italic; text-decoration: underline; text-underline-offset: 3px; }
.az-editor .token.parameter { color: #D9DADA; text-decoration: underline; text-underline-offset: 3px; }
.az-editor .token.property { color: #D9DADA; font-style: italic; text-decoration: underline; text-underline-offset: 3px; }
.az-editor .token.spec-property { color: #D9DADA; font-style: italic; }
.az-editor .token.override-property { color: #D9DADA; font-style: italic; text-decoration: underline; text-underline-offset: 3px; }
.az-editor .token.unused { color: #B8B8B8; }
.az-editor .token.unused-parameter { color: #B8B8B8; text-decoration: underline; text-underline-offset: 3px; }
.az-editor .token.unused-property { color: #B8B8B8; font-style: italic; text-decoration: underline; text-underline-offset: 3px; }
.az-editor .token.unused-spec-function, .az-editor .token.unused-spec-property { color: #B8B8B8; font-style: italic; }
.az-editor .token.unused-override-function, .az-editor .token.unused-override-property { color: #B8B8B8; font-style: italic; text-decoration: underline; text-underline-offset: 3px; }
.az-editor .token.string { color: #7DBF8A; }
.az-editor .token.number { color: #ECECEC; }
.az-editor .token.comment { color: #676767; font-style: italic; }
.az-editor .token.doc-comment { color: #6B9F77; font-style: italic; }
.az-editor .token.doc-tag { color: #5BA3D0; font-weight: bold; }
.az-editor .token.doc-param-name { color: #D9D9D9; }
.az-editor .token.annotation, .az-editor .token.decorator { color: var(--color-pastel-orange); }
.az-editor .token.variable { color: #D9DADA; }
.az-editor .token.preprocessor { color: #B06FA8; font-style: italic; }
.az-editor .token.macro { color: #B06FA8; font-weight: bold; }
.az-editor .token.interpolation { color: #D9D9D9; }
.az-editor .token.interpolation-punctuation { color: #E6C96B; }
.az-editor .token.operator, .az-editor .token.punctuation { color: #B2B3B3; }
`

export default function Hero({ engine }) {
  const [files, setFiles] = useState(loadProject)
  const [activeFile, setActiveFile] = useState('main.az')
  const [openFiles, setOpenFiles] = useState(['main.az'])
  const [output, setOutput] = useState(null)
  const [runningMode, setRunningMode] = useState(null)
  const [compilerDiagnostics, setCompilerDiagnostics] = useState([])
  const azls = useAzoraLanguageServer('0.0.5')

  const code = files[activeFile] || ''
  const { hasMain, hasTests } = useMemo(() => detectCapabilities(code), [code])
  const running = runningMode !== null

  useEffect(() => {
    window.localStorage.setItem(PROJECT_STORAGE_KEY, JSON.stringify(files))
  }, [files])

  useEffect(() => {
    if (!engine.ready) return undefined
    const timer = window.setTimeout(() => {
      const result = engine.check(code)
      setCompilerDiagnostics(result.success ? [] : parseCompilerDiagnostics(result.errors, code))
    }, 220)
    return () => window.clearTimeout(timer)
  }, [activeFile, code, engine.check, engine.ready])

  function updateActiveFile(nextCode) {
    setFiles((current) => ({ ...current, [activeFile]: nextCode }))
  }

  function openFile(path) {
    setOpenFiles((current) => current.includes(path) ? current : [...current, path])
    setActiveFile(path)
    setOutput(null)
  }

  function closeFile(path, event) {
    event.stopPropagation()
    if (openFiles.length === 1) return
    const index = openFiles.indexOf(path)
    const next = openFiles.filter((file) => file !== path)
    setOpenFiles(next)
    if (activeFile === path) setActiveFile(next[Math.max(0, index - 1)])
  }

  function resetProject() {
    setFiles(initialFiles)
    setOpenFiles(['main.az'])
    setActiveFile('main.az')
    setOutput(null)
    setCompilerDiagnostics([])
    window.localStorage.removeItem(PROJECT_STORAGE_KEY)
  }

  async function handleRun() {
    if (!engine.ready || running || !hasMain) return
    setRunningMode('run')
    setOutput(null)
    const result = await engine.interpret(code)
    setCompilerDiagnostics(result.success ? [] : parseCompilerDiagnostics(result.errors, code))
    setOutput(result)
    setRunningMode(null)
  }

  async function handleRunTests() {
    if (!engine.ready || running || !hasTests) return
    setRunningMode('test')
    setOutput(null)
    const result = await engine.runTests(code)
    setCompilerDiagnostics(result.success ? [] : parseCompilerDiagnostics(result.errors, code))
    setOutput(result)
    setRunningMode(null)
  }

  return (
    <>
      <style>{tokenCSS}</style>
      <section className="hero hero--moonlit" aria-labelledby="hero-title">
        <div className="hero__media" aria-hidden="true" />
        <div className="hero__veil" aria-hidden="true" />
        <div className="hero__content page-shell">
          <div className="hero__copy-block" data-reveal>
            <h1 id="hero-title">Write close to the machine.<br />Think beyond it.</h1>
            <div className="hero__divider" aria-hidden="true"><Sparkles /></div>
            <p className="hero__copy">
              Azora is a modern systems metaprogramming language that blends performance,<br />safety, and elegance for the connected era.
            </p>
            <div className="hero__actions">
              <a className="button button--primary" href="https://code.azoralang.org">
                <Sparkles aria-hidden="true" />Try Azora <ArrowRight aria-hidden="true" />
              </a>
              <a className="hero__book-link" href="https://book.azoralang.org">
                <BookOpen aria-hidden="true" />Read the Book
              </a>
            </div>
          </div>

          <div id="workspace" className="moonlit-workspace" data-reveal="up">
            <div className="workspace__body">
              <aside className="workspace__explorer" aria-label="Project files">
                <div className="workspace__explorer-title">
                  <span>Modules</span>
                  <div>
                    <button type="button" onClick={resetProject} title="Reset project" aria-label="Reset project"><MoreHorizontal /></button>
                  </div>
                </div>
                <div className="workspace__project-name"><span>⌄</span><Sparkles /> stellar-app</div>
                {fileTree.map((group) => (
                  <div className="workspace__folder" key={group.folder || 'root'}>
                    {group.folder && <div className="workspace__folder-name"><span>⌄</span>{group.folder}</div>}
                    {group.files.map((path) => (
                      <button
                        type="button"
                        key={path}
                        className={`workspace__file ${activeFile === path ? 'is-active' : ''}`}
                        onClick={() => openFile(path)}
                      >
                        <Sparkles /><span>{shortName(path)}</span>
                        {files[path] !== initialFiles[path] && <i aria-label="Modified" />}
                      </button>
                    ))}
                  </div>
                ))}
              </aside>

              <div className="workspace__main">
                <div className="workspace__tabs" role="tablist" aria-label="Open files">
                  {openFiles.map((path) => (
                    <div
                      role="tab"
                      tabIndex={0}
                      aria-selected={activeFile === path}
                      className={`workspace__tab ${activeFile === path ? 'is-active' : ''}`}
                      key={path}
                      onClick={() => setActiveFile(path)}
                      onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') setActiveFile(path) }}
                    >
                      <Sparkles /><span>{shortName(path)}</span>
                      {files[path] !== initialFiles[path] && <i aria-label="Modified" />}
                      <button type="button" onClick={(event) => closeFile(path, event)} aria-label={`Close ${shortName(path)}`}>×</button>
                    </div>
                  ))}
                  <div className="workspace__tab-actions">
                    {engine.loading && <span className="runtime__message"><Spinner /> Runtime</span>}
                    {hasMain && (
                      <button type="button" onClick={handleRun} disabled={!engine.ready || running} title="Run active file" aria-label="Run active file">
                        {runningMode === 'run' ? <Spinner /> : <Play />}
                      </button>
                    )}
                    {hasTests && (
                      <button type="button" onClick={handleRunTests} disabled={!engine.ready || running} title="Test active file" aria-label="Test active file">
                        {runningMode === 'test' ? <Spinner /> : <Bug />}
                      </button>
                    )}
                    <button type="button" onClick={resetProject} title="Reset project" aria-label="Reset project"><RotateCcw /></button>
                  </div>
                </div>
                <div className="az-editor runtime__editor">
                  <Suspense fallback={<div className="runtime__editor-loading">Loading editor</div>}>
                    <MiniCodeEditor
                      source={code}
                      onChange={updateActiveFile}
                      onRun={handleRun}
                      onRunTests={handleRunTests}
                      languageServer={azls.server}
                      diagnostics={compilerDiagnostics}
                      filePath={activeFile}
                    />
                  </Suspense>
                </div>
                {output && (
                  <div className="runtime__output">
                    <div>Output · {shortName(activeFile)}</div>
                    {output.success ? <pre>{output.output || '(no output)'}</pre> : <pre className="runtime__output-error">{output.errors}</pre>}
                  </div>
                )}
              </div>
            </div>
            <div className="workspace__statusbar">
              <span>{engine.error ? 'Engine unavailable' : 'Azora 0.0.5'}</span><span>{azls.loading ? 'AZLS loading' : azls.error ? 'AZLS unavailable' : 'AZLS ready'}</span><span>Spaces: 4</span>
            </div>
          </div>
          <p className="runtime__note" data-reveal>
            Experimental release. Azora is evolving quickly and is not yet recommended for production systems.
            <br />
            <strong>Roadmap:</strong> Azora <strong>0.1-stable</strong> is planned for release in <strong>May 2027</strong>.
          </p>
        </div>
      </section>

      <section className="runtime-intro section-band">
        <div className="page-shell page-shell--narrow" data-reveal>
          <span className="section-kicker">Language and tooling together</span>
          <h2>A workspace that understands Azora.</h2>
          <p>
            Edit every file, keep your project between visits, inspect semantic diagnostics and hover documentation, then run the active entry point without leaving the page.
          </p>
        </div>
      </section>
    </>
  )
}
