'use client'

interface ProgressBarProps {
  progress: number
}

export default function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <div className="w-full max-w-xl h-4 bg-muted rounded-full overflow-hidden">
      <div
        className="h-full bg-primary transition-all duration-500 ease-linear"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
