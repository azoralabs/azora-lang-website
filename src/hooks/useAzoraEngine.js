import { useState, useEffect, useCallback, useRef } from 'react'
import { loadWasmEngine } from '../engine/wasmLoader.js'

const VERSION = '0.1-dev'

export default function useAzoraEngine() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [attempt, setAttempt] = useState(0)
  const engineRef = useRef(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    engineRef.current = null

    loadWasmEngine(VERSION)
      .then((engine) => {
        if (!cancelled) {
          engineRef.current = engine
          setLoading(false)
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message || 'Failed to load WASM engine')
          setLoading(false)
        }
      })

    return () => { cancelled = true }
  }, [attempt])

  const retry = useCallback(() => setAttempt((current) => current + 1), [])

  const interpret = useCallback(async (source) => {
    if (!engineRef.current) return { success: false, output: '', errors: 'Engine not loaded' }
    return engineRef.current.interpret(source)
  }, [])

  const check = useCallback((source) => {
    if (!engineRef.current) return { success: false, output: '', errors: 'Engine not loaded' }
    return engineRef.current.check(source)
  }, [])

  const runTests = useCallback(async (source) => {
    if (!engineRef.current) return { success: false, output: '', errors: 'Engine not loaded' }
    return engineRef.current.runTests(source)
  }, [])

  return { loading, error, ready: !loading && !error, check, interpret, runTests, retry }
}
