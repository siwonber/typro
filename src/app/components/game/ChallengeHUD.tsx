'use client'

import { useEffect, useState } from 'react'

interface ChallengeHUDProps {
  errorCount: number
  maxErrors: number
  timeLimit: number
  onTimeUp?: () => void 
}

export default function ChallengeHUD({
  errorCount,
  maxErrors,
  timeLimit,
  onTimeUp,
}: ChallengeHUDProps) {
  const [elapsedTime, setElapsedTime] = useState(0)

  useEffect(() => {
    if (elapsedTime >= timeLimit) {
      if (onTimeUp) onTimeUp()
      return
    }

    const interval = setInterval(() => {
      setElapsedTime((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [elapsedTime, timeLimit, onTimeUp])

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
