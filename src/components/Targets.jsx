const targets = [
  {
    index: '01',
    name: 'Interpreted',
    desc: 'Run Azora directly with the built-in interpreter. Instant feedback, no build step, ideal for scripting and development.',
    color: 'text-pastel-teal',
    state: 'experimental'
  },
  {
    index: '02',
    name: 'LLVM IR',
    desc: 'Compile to LLVM intermediate representation for native performance on any platform.',
    color: 'text-pastel-green',
    state: 'experimental'
  },
  {
    index: '03',
    name: 'JavaScript',
    desc: 'Generate JavaScript for web browsers and Node.js. Build full-stack with one language.',
    color: 'text-pastel-orange',
    state: 'experimental'
  },
  {
    index: '04',
    name: 'WebAssembly',
    desc: 'WASI-compatible WebAssembly for high-performance browser and edge runtime execution.',
    color: 'text-pastel-white',
    state: 'experimental'
  },
]

export default function Targets() {
  return (
    <section id="targets" className="targets section-band section-band--contrast">
      <div className="page-shell">
        <div className="section-heading section-heading--split" data-reveal>
          <div>
            <span className="section-kicker">Compilation targets</span>
            <h2>One language. Four ways to run.</h2>
          </div>
          <p>Stay in the interpreter while you explore, then take the same source to native, browser, server, or edge runtimes.</p>
        </div>
        <div className="targets__rail glass-panel" data-reveal="up">
          {targets.map((target, index) => (
            <article className="target" key={target.name} style={{ '--reveal-order': index }}>
              <div className="target__meta">
                <span className="target__index">{target.index}</span>
                <span className="target__state">{target.state}</span>
              </div>
              <h3 className={target.color}>{target.name}</h3>
              <p>{target.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
