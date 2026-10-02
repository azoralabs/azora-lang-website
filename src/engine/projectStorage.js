export const PROJECT_STORAGE_KEY = 'azora-lang-moonlit-project-v3'

export function restoreProject(initialFiles, storage) {
  try {
    const stored = JSON.parse(storage.getItem(PROJECT_STORAGE_KEY))
    if (stored && typeof stored === 'object') {
      return Object.fromEntries(Object.entries(initialFiles).map(([path, initial]) => {
        let source = typeof stored[path] === 'string' ? stored[path] : initial
        if (path === 'main.az') {
          source = source
            .replace(/\bfunc\s+greeting\[self:\s*Self&\]\(\)/g, 'func &.greeting()')
            .replace(/Language\("Azora", "0\.1(?:\.0)?-dev"\)/g, 'Language("Azora", "0.1-dev")')
        }
        return [path, source]
      }))
    }
  } catch {}
  return initialFiles
}
