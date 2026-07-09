import { useState } from 'react'
import { Link } from 'react-router-dom'

const external = [
  { label: 'Playground', href: 'https://code.azoralang.org' },
  { label: 'Book', href: 'https://book.azoralang.org' },
  { label: 'Documentation', href: 'https://docs.azoralang.org' },
  { label: 'Community', href: 'https://azoralabs.org/community' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-az-90/80 backdrop-blur-md border-b border-az-75 px-4">
      <div className="max-w-6xl mx-auto h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src="/assets/azora_logo.svg" alt="Azora" className="h-7 w-7" />
          <span className="font-semibold text-az-10">Azora Programming Language</span>
          <span className="text-[10px] text-az-60 ml-1.5 border border-az-65 rounded px-1.5 py-0.5">v0.0.2</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
{external.map(s => (
            <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer" className="text-sm text-az-40 hover:text-az-primary transition-colors">
              {s.label}
            </a>
          ))}
          <a href="https://azoralabs.org/donate" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-bold text-white bg-az-primary hover:bg-az-primary/80 transition-colors px-3 py-1.5 rounded-lg">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
            </svg>
            Donate
          </a>
        </div>

        {/* Mobile hamburger */}
        <button onClick={() => setOpen(!open)} className="md:hidden text-az-40 hover:text-az-10" aria-label="Toggle menu">
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

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-az-85 border-b border-az-75 px-4 pb-4 pt-2 flex flex-col gap-3">
{external.map(s => (
            <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer" className="text-sm text-az-40 hover:text-az-primary transition-colors">
              {s.label}
            </a>
          ))}
          <a href="https://azoralabs.org/donate" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-1.5 text-sm font-bold text-white bg-az-primary hover:bg-az-primary/80 transition-colors px-3 py-1.5 rounded-lg">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
            </svg>
            Donate
          </a>
        </div>
      )}
    </nav>
  )
}
