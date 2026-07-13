// SVG icon components for each feature
const icons = {
  syntax: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  ),
  packs: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 002 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  ),
  generics: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="4 7 4 4 20 4 20 7" />
      <line x1="9" y1="20" x2="15" y2="20" />
      <line x1="12" y1="4" x2="12" y2="20" />
    </svg>
  ),
  tuples: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="12" r="3" />
      <circle cx="16" cy="12" r="3" />
      <path d="M2 12h3" />
      <path d="M11 12h2" />
      <path d="M19 12h3" />
    </svg>
  ),
  async: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10" />
      <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
    </svg>
  ),
  flows: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="12" x2="2" y2="12" />
      <polyline points="15 5 22 12 15 19" />
      <polyline points="9 19 2 12 9 5" />
    </svg>
  ),
  trees: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="5" r="3" />
      <circle cx="6" cy="17" r="3" />
      <circle cx="18" cy="17" r="3" />
      <line x1="10" y1="7.5" x2="7.5" y2="14.5" />
      <line x1="14" y1="7.5" x2="16.5" y2="14.5" />
    </svg>
  ),
  testing: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  collections: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
    </svg>
  ),
  errors: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  memory: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <rect x="9" y="9" width="6" height="6" />
      <line x1="9" y1="1" x2="9" y2="4" />
      <line x1="15" y1="1" x2="15" y2="4" />
      <line x1="9" y1="20" x2="9" y2="23" />
      <line x1="15" y1="20" x2="15" y2="23" />
      <line x1="20" y1="9" x2="23" y2="9" />
      <line x1="20" y1="14" x2="23" y2="14" />
      <line x1="1" y1="9" x2="4" y2="9" />
      <line x1="1" y1="14" x2="4" y2="14" />
    </svg>
  ),
  targets: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  ),
  meta: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  ),
  ctce: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  ffi: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  ),
  contracts: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  ),
  di: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  ),
  reactivity: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
}

const features = [
  { icon: 'syntax', title: 'Clean, Expressive Syntax', desc: 'Kotlin + Rust like syntax with modern ergonomics. Type inference, pattern matching, and single-expression functions reduce boilerplate.' },
  { icon: 'packs', title: 'Packs, Enums & Slots', desc: 'Data packs for structures, enums for constants, and slots for tagged unions with exhaustive pattern matching.' },
  { icon: 'generics', title: 'Generics & Specs', desc: 'Full generic types and functions with spec constraints. Monomorphized at compile time for zero-cost abstractions.' },
  { icon: 'tuples', title: 'Tuples', desc: 'Built-in heterogeneous tuples with (a, b, c) syntax. Access elements by position with .0, .1, .2 notation.' },
  { icon: 'async', title: 'Async / Await', desc: 'First-class structured concurrency with tasks, async/await, and launch. Built into the language, not bolted on.' },
  { icon: 'flows', title: 'Flows & Generators', desc: 'Lazy generator sequences with yield. Compose data pipelines that only compute values on demand.' },
  { icon: 'trees', title: 'Inheritance', desc: 'Single inheritance with node types. Override with repl, prevent extension with leaf, call parent with base.' },
  { icon: 'testing', title: 'Built-in Testing', desc: 'Test blocks are a language construct. Write tests next to your code with assert and trace, no framework needed.' },
  { icon: 'collections', title: 'Collection Literals', desc: 'Kotlin-inspired collection APIs such as listOf, setOf, List, MutableList, Map, and MutableMap in std.container.' },
  { icon: 'errors', title: 'Error Handling', desc: 'Typed error returns with fail, throw, try, and catch. Guard statements for nullable unwrapping. Rescue for recovery.' },
  { icon: 'memory', title: 'Memory Management', desc: 'Manual memory control with alloc, drop, ref, mut, shared and weak. Zones for arena allocation and unsafe blocks when you need them.' },
  { icon: 'targets', title: 'Multi-Target Compilation', desc: 'Run interpreted, or compile to LLVM IR, JavaScript, or WebAssembly from a single codebase.' },
  { icon: 'meta', title: 'Metaprogramming', desc: 'Decorators, compile-time introspection with hasDeco and getDeco, and deepinline blocks for bulk code generation.' },
  { icon: 'ctce', title: 'Compile-Time Execution', desc: 'Inline if/for blocks evaluate at compile time. Conditionally emit code, unroll loops, and resolve constants before runtime.' },
  { icon: 'ffi', title: 'Bridge (Foreign Functions)', desc: 'Call native C, Objective-C, and JavaScript functions via the bridge keyword.' },
  { icon: 'contracts', title: 'Contracts', desc: 'Preconditions with in, postconditions with out. Design by Contract philosophy enforced at runtime.' },
  { icon: 'di', title: 'Dependency Injection', desc: 'Built-in DI with solo singletons, wrap containers, inject resolution, and bind mappings. Lazy bindings break circular deps.' },
  { icon: 'reactivity', title: 'Reactivity', desc: 'Reactive state with rem for persistence, view for UI components, and effect for side effects that track dependencies.' },
]

export default function Features() {
  return (
    <section id="features" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-2 text-center">Features</h2>
        <p className="text-az-45 text-center mb-12 max-w-2xl mx-auto">
          Everything you need to build modern software, all in one language.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map(f => (
            <div key={f.title} className="rounded-xl border border-az-75 bg-az-85 p-5 hover:border-az-60 transition-colors">
              <span className="inline-block text-az-primary mb-3">{icons[f.icon]}</span>
              <h3 className="font-semibold text-az-10 mb-2">{f.title}</h3>
              <p className="text-sm text-az-45 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
