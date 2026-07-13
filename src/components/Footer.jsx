export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="page-shell site-footer__inner">
        <div className="site-footer__brand">
          <img src="/assets/azora_logo.svg" alt="" />
          <div>
            <strong>Azora</strong>
            <span>Programming language</span>
          </div>
        </div>
        <div className="site-footer__links">
          <a href="https://docs.azoralang.org" target="_blank" rel="noopener noreferrer">Documentation</a>
          <a href="https://azoralabs.org/community" target="_blank" rel="noopener noreferrer">Community</a>
          <a href="https://github.com/azora-labs" target="_blank" rel="noopener noreferrer">GitHub</a>
        </div>
        <p>&copy; {new Date().getFullYear()} Azora Labs.</p>
      </div>
    </footer>
  )
}
