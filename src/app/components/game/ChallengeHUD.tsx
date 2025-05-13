'use client'

interface ChallengeHUDProps {
  elapsedTime: string
  errorCount: number
  maxErrors: number
  timeLimit: number
}

export default function ChallengeHUD({
  elapsedTime,
  errorCount,
  maxErrors,
  timeLimit
}: ChallengeHUDProps) {
  return (
    <div className="bg-surface px-6 py-3 rounded-xl shadow-md flex gap-8 text-sm font-medium text-muted justify-center mt-2">
      <div className="flex flex-col items-center">
        <span className="text-xs uppercase">Time</span>
        <span>{elapsedTime}s / {timeLimit}s</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-xs uppercase">Errors</span>
        <span>{errorCount} / {maxErrors}</span>
      </div>
    </div>
  )
}
