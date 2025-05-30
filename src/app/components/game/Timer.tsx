'use client'

import { useEffect, useState, useRef } from 'react'

export default function Timer({ started }: { started: boolean }) {
  const [seconds, setSeconds] = useState(60)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (started && intervalRef.current === null) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!)
            intervalRef.current = null
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [started])

  return <div className="text-2xl font-bold">⏱ {seconds}s</div>
}
