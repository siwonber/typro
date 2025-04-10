'use client'

import { useEffect, useState } from 'react'

interface CountdownProps {
  onCountdownFinish: () => void
}

export default function Countdown({ onCountdownFinish }: CountdownProps) {
  const [seconds, setSeconds] = useState(5)

  useEffect(() => {
    if (seconds === 0) {
      onCountdownFinish()
      return
    }

    const interval = setInterval(() => {
      setSeconds(prev => prev - 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [seconds, onCountdownFinish])

  return (
    <div className="text-2xl font-bold text-center">
      Get ready... {seconds}
    </div>
  )
}
