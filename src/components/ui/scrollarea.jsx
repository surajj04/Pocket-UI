// components/ui/scroll-area.jsx
export function ScrollArea ({ children, className }) {
  return (
    <div
      className={`overflow-y-auto p-4 ${className}`}
      style={{ maxHeight: 'calc(100vh - 200px)' }}
    >
      {children}
    </div>
  )
}
