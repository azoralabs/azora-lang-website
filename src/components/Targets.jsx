import { Gpu, Sparkles, SquareTerminal } from 'lucide-react'
import { SiLlvm, SiWebassembly } from 'react-icons/si'

const targets = [
  {
    index: '01',
    name: 'Interpreted',
    desc: 'Run Azora directly with the built-in interpreter. Instant feedback, no build step, ideal for scripting and development.',
    color: 'text-pastel-teal',
    state: 'experimental',
    icon: SquareTerminal,
  },
  {
    index: '02',
    name: 'LLVM IR',
    desc: 'Compile to LLVM intermediate representation for native performance on any platform.',
    color: 'text-pastel-green',
    state: 'experimental',
    icon: SiLlvm,
  },
  {
    index: '03',
    name: 'WebAssembly',
    desc: 'Generate WebAssembly text for browser and other hosts. Host imports provide runtime services; backend coverage is still evolving.',
    color: 'text-pastel-white',
    state: 'experimental',
    icon: SiWebassembly,
  },
  {
    index: '04',
    name: 'GPU',
    desc: 'Compile Azora vertex, fragment, and compute shaders to DXIL for DirectX, SPIR-V for Vulkan, and Metallib for Metal.',
    color: 'text-pastel-purple',
    state: 'experimental',
    icon: Gpu,
  },
]

export default function Targets() {
  return (
    <section id="targets" className="targets section-band section-band--contrast">
      <div className="page-shell">
        <div className="section-heading section-heading--split" data-reveal>
          <div>
            <span className="section-kicker"><Sparkles aria-hidden="true" />Compilation targets</span>
            <h2>One language. Four ways to run.</h2>
          </div>
          <p>Run Azora with the interpreter, compile for native and WebAssembly runtimes, or write shaders for the GPU.</p>
        </div>
        <div className="targets__rail" data-reveal="up">
          {targets.map((target, index) => (
            <article className="target" key={target.name} style={{ '--reveal-order': index }}>
              <target.icon className="target__icon" aria-hidden="true" />
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
