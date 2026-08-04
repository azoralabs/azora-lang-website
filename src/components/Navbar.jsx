import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Code2, FileText, Heart, Menu, Orbit, Sparkles, X } from 'lucide-react'
import { FaGithub } from 'react-icons/fa'

const productLinks = [
  { label: 'Learn', href: 'https://book.azoralang.org', icon: BookOpen },
  { label: 'Docs', href: 'https://docs.azoralang.org', icon: FileText },
  { label: 'Playground', href: 'https://code.azoralang.org', icon: Code2 },
]

const ecosystemLinks = [
  { label: 'Azora Labs', description: 'Open-source organization', href: 'https://azoralabs.org' },
  { label: 'Azora Engine', description: 'Cross-platform game engine', href: 'https://azoraengine.org' },
  { label: 'Azora Studio', description: 'Development environment', href: 'https://azorastudio.org' },
  { label: 'Azora Dev', description: 'Community and technical Q&A', href: 'https://azora.dev' },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [ecosystemOpen, setEcosystemOpen] = useState(false)
  const ecosystemRef = useRef(null)

  useEffect(() => {
    const closeMenus = (event) => {
      if (event.key === 'Escape') {
        setMobileOpen(false)
        setEcosystemOpen(false)
      }
      if (event.type === 'pointerdown' && !ecosystemRef.current?.contains(event.target)) {
        setEcosystemOpen(false)
      }
    }
    document.addEventListener('keydown', closeMenus)
    document.addEventListener('pointerdown', closeMenus)
    return () => {
      document.removeEventListener('keydown', closeMenus)
      document.removeEventListener('pointerdown', closeMenus)
    }
  }, [])

  const closeMobile = () => setMobileOpen(false)

  return (
    <nav className="site-nav">
      <div className="page-shell site-nav__inner">
        <Link to="/" className="site-nav__brand" aria-label="Azora language home">
          <img src="/assets/azora-moon-avatar.png" alt="" />
          <span>Azora Lang</span>
          <Sparkles className="site-nav__brand-spark" aria-hidden="true" />
        </Link>

        <div className="site-nav__meta" aria-label="Azora release">
          <span className="version-tag">v0.0.5</span>
        </div>

        <div className="site-nav__links">
          {productLinks.map(({ icon: Icon, ...link }) => (
            <a key={link.href} href={link.href}><Icon aria-hidden="true" />{link.label}</a>
          ))}
          <div className="site-nav__ecosystem" ref={ecosystemRef}>
            <button
              className={`site-nav__ecosystem-trigger ${ecosystemOpen ? 'is-open' : ''}`}
              aria-expanded={ecosystemOpen}
              aria-haspopup="menu"
              onClick={() => setEcosystemOpen((open) => !open)}
            >
              <Orbit aria-hidden="true" />Ecosystem
            </button>
            {ecosystemOpen && (
              <div className="site-nav__dropdown" role="menu">
                {ecosystemLinks.map((link) => (
                  <a key={link.href} href={link.href} role="menuitem">
                    <strong>{link.label}</strong>
                    <span>{link.description}</span>
                  </a>
                ))}
              </div>
            )}
          </div>
          <a href="https://github.com/azoralabs/azora-lang" className="site-nav__github"><FaGithub aria-hidden="true" />GitHub</a>
          <a className="site-nav__donate" href="https://azoralabs.org/donate"><Heart aria-hidden="true" />Donate</a>
        </div>

        <button
          onClick={() => setMobileOpen((open) => !open)}
          className="site-nav__toggle"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="site-nav__mobile">
          {productLinks.map(({ icon: Icon, ...link }) => (
            <a key={link.href} href={link.href} onClick={closeMobile}><Icon aria-hidden="true" />{link.label}</a>
          ))}
          <span className="site-nav__mobile-label">Azora Ecosystem</span>
          {ecosystemLinks.map((link) => (
            <a key={link.href} href={link.href} onClick={closeMobile}>{link.label}</a>
          ))}
          <a href="https://github.com/azoralabs/azora-lang" onClick={closeMobile}><FaGithub aria-hidden="true" />GitHub</a>
          <a className="site-nav__mobile-donate" href="https://azoralabs.org/donate" onClick={closeMobile}>
            <Heart aria-hidden="true" />Donate
          </a>
        </div>
      )}
    </nav>
  )
}
