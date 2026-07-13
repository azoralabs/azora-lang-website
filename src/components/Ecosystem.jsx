const links = [
  {
    title: 'Playground',
    desc: 'Write, run, and share Azora code directly in your browser. No setup required.',
    href: 'https://code.azoralang.org',
    cta: 'Open Playground',
    label: 'Build',
  },
  {
    title: 'The Azora Book',
    desc: 'A comprehensive 41-chapter guide covering everything from basics to advanced concurrency, inheritance, FFI, and more.',
    href: 'https://book.azoralang.org',
    cta: 'Start Reading',
    label: 'Learn',
  },
]

export default function Ecosystem() {
  return (
    <section id="ecosystem" className="ecosystem section-band section-band--deep">
      <div className="page-shell">
        <div className="section-heading" data-reveal>
          <span className="section-kicker">Ecosystem</span>
          <h2>Go from curious to fluent.</h2>
          <p>Run the language in your browser, then go deeper with the complete Azora guide.</p>
        </div>
        <div className="ecosystem__grid">
          {links.map((link, index) => (
            <a
              key={link.title}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="ecosystem-card glass-panel"
              data-reveal="up"
              style={{ '--reveal-order': index }}
            >
              <span className="ecosystem-card__label">{link.label}</span>
              <h3>{link.title}</h3>
              <p>{link.desc}</p>
              <span className="ecosystem-card__cta">{link.cta} <span aria-hidden="true">↗</span></span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
