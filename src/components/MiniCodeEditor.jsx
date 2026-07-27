import { useEffect, useRef } from 'react'
import { closeBrackets, closeBracketsKeymap } from '@codemirror/autocomplete'
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands'
import { bracketMatching, indentOnInput, indentUnit } from '@codemirror/language'
import { forceLinting } from '@codemirror/lint'
import { searchKeymap } from '@codemirror/search'
import { EditorState } from '@codemirror/state'
import { EditorView, highlightActiveLine, keymap } from '@codemirror/view'
import { azlsExtensions, refreshAzoraDiagnostics } from '../codemirror/azls.js'
import { azoraTheme } from '../codemirror/azora-theme.js'

export default function MiniCodeEditor({
  source,
  onChange,
  onRun,
  onRunTests,
  languageServer,
  diagnostics,
}) {
  const containerRef = useRef(null)
  const viewRef = useRef(null)
  const sourceRef = useRef(source)
  const emittedSourceRef = useRef(source)
  const onChangeRef = useRef(onChange)
  const onRunRef = useRef(onRun)
  const onRunTestsRef = useRef(onRunTests)
  const diagnosticsRef = useRef(diagnostics)

  sourceRef.current = source
  onChangeRef.current = onChange
  onRunRef.current = onRun
  onRunTestsRef.current = onRunTests
  diagnosticsRef.current = diagnostics

  useEffect(() => {
    if (!containerRef.current) return undefined

    const state = EditorState.create({
      doc: sourceRef.current,
      extensions: [
        history(),
        highlightActiveLine(),
        bracketMatching(),
        closeBrackets(),
        indentOnInput(),
        azoraTheme,
        EditorState.tabSize.of(4),
        indentUnit.of('    '),
        keymap.of([
          ...closeBracketsKeymap,
          ...defaultKeymap,
          ...searchKeymap,
          ...historyKeymap,
          indentWithTab,
          { key: 'Mod-Enter', run: () => { onRunRef.current?.(); return true } },
          { key: 'Mod-Shift-Enter', run: () => { onRunTestsRef.current?.(); return true } },
        ]),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            const nextSource = update.state.doc.toString()
            emittedSourceRef.current = nextSource
            onChangeRef.current?.(nextSource)
          }
        }),
        ...azlsExtensions(languageServer, null, () => diagnosticsRef.current),
      ],
    })

    const view = new EditorView({ state, parent: containerRef.current })
    viewRef.current = view

    return () => {
      view.destroy()
      viewRef.current = null
    }
  }, [languageServer])

  useEffect(() => {
    const view = viewRef.current
    if (!view) return
    if (source === emittedSourceRef.current) return
    const currentSource = view.state.doc.toString()
    if (source !== currentSource) {
      emittedSourceRef.current = source
      view.dispatch({ changes: { from: 0, to: currentSource.length, insert: source } })
    }
  }, [source])

  useEffect(() => {
    const view = viewRef.current
    if (!view) return
    view.dispatch({ effects: refreshAzoraDiagnostics.of(null) })
    forceLinting(view)
  }, [diagnostics])

  return <div ref={containerRef} className="runtime__code-editor" aria-label="Azora source editor" />
}
