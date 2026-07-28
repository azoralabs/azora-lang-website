export default function ExternalLinkIcon({ className = '' }) {
  return (
    <svg
      className={`external-link-icon ${className}`.trim()}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M5 11 11 5" />
      <path d="M6 5h5v5" />
    </svg>
  )
}
