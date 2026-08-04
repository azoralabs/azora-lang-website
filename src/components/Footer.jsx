import { BookOpen, MessageCircle } from 'lucide-react'
import { FaGithub } from 'react-icons/fa'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="page-shell site-footer__inner">
        <div className="site-footer__brand">
          <img src="/assets/azora-moon-avatar.png" alt="" />
          <div>
            <strong>Azora Lang</strong>
            <span>Power with a little magic.</span>
          </div>
        </div>
        <div className="site-footer__links">
          <a href="https://book.azoralang.org" target="_blank" rel="noopener noreferrer"><BookOpen aria-hidden="true" />Book</a>
          <a href="https://azora.dev" target="_blank" rel="noopener noreferrer"><MessageCircle aria-hidden="true" />Community</a>
          <a href="https://github.com/azoralabs/azora-lang" target="_blank" rel="noopener noreferrer"><FaGithub aria-hidden="true" />GitHub</a>
        </div>
        <p>&copy; {new Date().getFullYear()} Azora Labs.</p>
      </div>
    </footer>
  )
}
