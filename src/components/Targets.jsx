const targets = [
  {
    name: 'LLVM IR',
    desc: 'Compile to LLVM intermediate representation for native performance on any platform.',
    color: 'text-pastel-green',
    state: 'experimental'
  },
  {
    name: 'Kotlin / JVM',
    desc: 'Compile to Kotlin and run on the JVM or KMP. Access the entire Java and Kotlin ecosystem.',
    color: 'text-pastel-purple',
    state: 'experimental'
  },
  {
    name: 'TypeScript',
    desc: 'Generate TypeScript for web browsers and Node.js. Build full-stack with one language.',
    color: 'text-pastel-teal',
    state: 'experimental'
  },
  {
    name: 'Swift',
    desc: 'Compile to Swift 6 for Apple platforms. Native protocols, classes, and Foundation integration.',
    color: 'text-pastel-pink',
    state: 'experimental'
  },
  {
    name: 'Dart',
    desc: 'Target Dart 3 with sealed classes, pattern matching, null safety, and Flutter widget support.',
    color: 'text-pastel-darkblue',
    state: 'experimental'
  },
  {
    name: 'C# / .NET',
    desc: 'Target C# for .NET applications. Leverage the .NET runtime and libraries.',
    color: 'text-pastel-blue',
    state: 'experimental'
  },
  {
    name: 'Rust',
    desc: 'Compile to Rust with ownership semantics, enum tagged unions, traits, and zero-cost abstractions.',
    color: 'text-pastel-red',
    state: 'experimental'
  },
  {
    name: 'Python',
    desc: 'Generate Python 3 code. Integrate with the Python ecosystem for data science, scripting, and automation.',
    color: 'text-pastel-orange',
    state: 'experimental'
  },
  {
    name: 'WebAssembly',
    desc: 'WASI-compatible WebAssembly for high-performance browser and edge runtime execution.',
    color: 'text-pastel-white',
    state: 'experimental'
  },
]

export default function Targets() {
  return (
    <section id="targets" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-2 text-center">Compilation Targets</h2>
        <p className="text-az-45 text-center mb-12 max-w-2xl mx-auto">
          One language, multiple platforms. Azora compiles to the backend that fits your project.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {targets.map(t => (
            <div key={t.name} className={`relative rounded-xl border border-az-75 bg-az-85 p-6 text-center transition-colors overflow-hidden ${
              t.state === 'experimental' ? 'hover:border-az-60' : 'opacity-50 pointer-events-none'
            }`}>
              <span className={`absolute top-5 -right-8 rotate-[30deg] text-xs font-bold uppercase tracking-wide px-10 py-1 ${
                t.state === 'experimental'
                  ? 'bg-pastel-red text-az-95'
                  : 'bg-az-60 text-az-95'
              }`}>
                {t.state}
              </span>
              <h3 className={`font-mono font-bold text-lg mb-3 ${t.color}`}>{t.name}</h3>
              <p className="text-sm text-az-45 leading-relaxed">{t.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
