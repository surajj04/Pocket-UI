// components/ui/badge.jsx
export function Badge ({ children, className, color = 'gray' }) {
  const badgeColors = {
    gray: 'bg-gray-200 text-gray-800',
    violet: 'bg-violet-500 text-white',
    green: 'bg-green-500 text-white',
    red: 'bg-red-500 text-white',
    blue: 'bg-blue-500 text-white',
    yellow: 'bg-yellow-500 text-black'
  }

  return (
    <span
      className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${badgeColors[color]} ${className}`}
    >
      {children}
    </span>
  )
}
