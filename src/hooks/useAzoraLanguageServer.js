import { useCallback, useEffect, useRef, useState } from 'react'
import { loadAzoraLanguageServer } from '../engine/azlsLoader.js'

export default function useAzoraLanguageServer(version) {
  const [state, setState] = useState({ loading: true, server: null, error: null })
  const generation = useRef(0)
  const [attempt, setAttempt] = useState(0)
  const retry = useCallback(() => setAttempt((current) => current + 1), [])

  useEffect(() => {
    const currentGeneration = ++generation.current
    setState({ loading: true, server: null, error: null })

    loadAzoraLanguageServer(version).then((server) => {
      if (generation.current === currentGeneration) {
        setState({ loading: false, server, error: null })
      }
    }).catch((error) => {
      if (generation.current === currentGeneration) {
        setState({ loading: false, server: null, error: error.message || String(error) })
      }
    })
    return () => { generation.current += 1 }
  }, [version, attempt])

  return { ...state, retry }
}
