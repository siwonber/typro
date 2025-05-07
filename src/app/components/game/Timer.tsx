'use client'

import { useEffect, useState } from 'react'

export default function Timer() {
  const [seconds, setSeconds] = useState(60)

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return <div className="text-lg font-bold">⏱ {seconds}s</div>
}
