import { useState } from 'react'
import { Link } from 'react-router-dom'

const external = [
  { label: 'Playground', href: 'https://code.azoralang.org' },
  { label: 'Book', href: 'https://book.azoralang.org' },
  { label: 'Docs', href: 'https://docs.azoralang.org' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="site-nav">
      <div className="page-shell site-nav__inner">
        <Link to="/" className="site-nav__brand" aria-label="Azora home">
          <img src="/assets/azora_logo.svg" alt="" />
          <span>Azora</span>
        </Link>

        <div className="site-nav__meta" aria-label="Azora release">
          <span>Programming language</span>
          <span className="version-tag">v0.0.3</span>
        </div>

        <div className="site-nav__links">
          <a href="#features">Features</a>
          <a href="#targets">Targets</a>
          {external.map(s => (
            <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer">
              {s.label}
            </a>
          ))}
          <a className="site-nav__donate" href="https://azoralabs.org/donate" target="_blank" rel="noopener noreferrer">
            Donate
          </a>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="site-nav__toggle"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="site-nav__mobile glass-panel">
          <a href="#features" onClick={() => setOpen(false)}>Features</a>
          <a href="#targets" onClick={() => setOpen(false)}>Targets</a>
          {external.map(s => (
            <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer">
              {s.label}
            </a>
          ))}
          <a href="https://azoralabs.org/community" target="_blank" rel="noopener noreferrer">Community</a>
        </div>
      )}
    </nav>
  )
}
