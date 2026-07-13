import { useEffect } from 'react'
import useAzoraEngine from './hooks/useAzoraEngine'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Features from './components/Features'
import CodeShowcase from './components/CodeShowcase'
import Targets from './components/Targets'
import Ecosystem from './components/Ecosystem'
import Footer from './components/Footer'

export default function App() {
  const engine = useAzoraEngine()

  useEffect(() => {
    const root = document.documentElement
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = null

    function updateScrollState() {
      const maxScroll = Math.max(document.body.scrollHeight - window.innerHeight, 1)
      root.style.setProperty('--scroll-progress', Math.min(window.scrollY / maxScroll, 1))
      root.style.setProperty('--hero-shift', `${Math.min(window.scrollY * 0.12, 96)}px`)
      frame = null
    }

    function handleScroll() {
      if (frame === null) frame = window.requestAnimationFrame(updateScrollState)
    }

    const revealItems = [...document.querySelectorAll('[data-reveal]')]
    root.classList.add('motion-ready')

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.08 },
    )

    revealItems.forEach(item => observer.observe(item))
    updateScrollState()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', handleScroll)
      if (frame !== null) window.cancelAnimationFrame(frame)
      root.classList.remove('motion-ready')
      root.style.removeProperty('--scroll-progress')
      root.style.removeProperty('--hero-shift')
    }
  }, [])

  return (
    <>
      <div className="scroll-progress" aria-hidden="true" />
      <Navbar />
      <main>
        <Hero engine={engine} />
        <Features />
        <CodeShowcase engine={engine} />
        <Targets />
        <Ecosystem />
      </main>
      <Footer />
    </>
  )
}
