'use client'

interface FancyButtonProps {
  onClick: () => void
  children: React.ReactNode
  className?: string
}

export default function FancyButton({ onClick, children, className = '' }: FancyButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`group relative overflow-hidden isolate px-6 py-2 rounded-full text-text font-semibold border-2 border-primary transition duration-300 ${className}`}
    >
      <span className="relative z-10 group-hover:text-black transition-colors">{children}</span>
      <span className="absolute inset-0 w-0 group-hover:w-full transition-all duration-500 ease-out bg-primary z-0 origin-left rounded-full"></span>
    </button>
  )
}
