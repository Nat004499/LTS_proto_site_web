export function Icon({ name, size = 16 }) {
  const props = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.7,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  }
  switch (name) {
    case 'home':
      return (
        <svg {...props}>
          <path d="M3 11.5 12 4l9 7.5" />
          <path d="M5 10v10h14V10" />
        </svg>
      )
    case 'devices':
      return (
        <svg {...props}>
          <rect x="3" y="5" width="18" height="14" rx="1.5" />
          <path d="M7 5v14M17 5v14M3 12h4M17 12h4M9 9h6M9 15h6" />
        </svg>
      )
    case 'history':
      return (
        <svg {...props}>
          <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
          <path d="M3 3v5h5" />
          <path d="M12 7v5l3 2" />
        </svg>
      )
    case 'logs':
      return (
        <svg {...props}>
          <path d="M6 3h10l4 4v14H6z" />
          <path d="M14 3v5h6" />
          <path d="M9 13h8M9 17h8M9 9h2" />
        </svg>
      )
    case 'download':
      return (
        <svg {...props}>
          <path d="M12 4v12" />
          <path d="m6 10 6 6 6-6" />
          <path d="M5 20h14" />
        </svg>
      )
    case 'caliper':
      return (
        <svg {...props} strokeWidth="1.5">
          <rect x="3" y="9" width="18" height="6" rx="1" />
          <path d="M6 9v3M9 9v2M12 9v3M15 9v2M18 9v3" />
          <path d="M3 15h2v3H3zM19 15h2v3h-2z" />
        </svg>
      )
    case 'dial':
      return (
        <svg {...props} strokeWidth="1.5">
          <circle cx="12" cy="12" r="8" />
          <circle cx="12" cy="12" r="1.2" fill="currentColor" />
          <path d="m12 12 4-3" />
          <path d="M12 4v1M12 19v1M4 12h1M19 12h1" />
        </svg>
      )
    case 'wrench':
      return (
        <svg {...props} strokeWidth="1.5">
          <path d="M14 7a4 4 0 1 0 3 3l4 4-3 3-4-4a4 4 0 0 1-5-1l1-1 3 1 1-3-1-3z" />
        </svg>
      )
    case 'play':
      return (
        <svg {...props}>
          <path d="m6 4 14 8L6 20z" fill="currentColor" stroke="none" />
        </svg>
      )
    default:
      return null
  }
}
