'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import GameText from './GameText'
import Timer from './Timer'
import ProgressBar from './ProgressBar'
import ResultScreen from './ResultScreen'
import Countdown from '@/components/Countdown'
import FancyButton from '@/components/ui/FancyButton'

const targetText = 'The quick brown fox jumps over the lazy dog.'

export default function MatchScreen({ mode }: { mode: 'ranked' | 'normal' }) {
  const [input, setInput] = useState('')
  const [startTime, setStartTime] = useState<number | null>(null)
  const [finished, setFinished] = useState(false)
  const [showCountdown, setShowCountdown] = useState(true)

  const router = useRouter()

  const handleCountdownFinish = () => {
    setShowCountdown(false)
    setStartTime(Date.now())
  }

  const correctChars = input
    .split('')
    .filter((char, i) => char === targetText[i]).length

  const progress = Math.min(100, (correctChars / targetText.length) * 100)

  useEffect(() => {
    if (!finished && input.length >= targetText.length) {
      setFinished(true)
    }
  }, [input, finished])

  useEffect(() => {
    if (!showCountdown && !finished) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key.length === 1 && input.length < targetText.length) {
          setInput((prev) => prev + e.key)
        }
        if (e.key === 'Backspace') {
          setInput((prev) => prev.slice(0, -1))
        }
      }

      window.addEventListener('keydown', handleKeyDown)
      return () => window.removeEventListener('keydown', handleKeyDown)
    }
  }, [showCountdown, finished, input.length])

  const elapsedTime = startTime ? ((Date.now() - startTime) / 1000).toFixed(2) : '0.00'

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center gap-6 text-text select-none relative">
      {/* 🔙 Leave Match Button */}
      {!finished && (
        <div className="absolute top-4 right-4">
          <FancyButton onClick={() => router.push('/home')} className="text-sm px-4 py-2">
            Leave Match
          </FancyButton>
        </div>
      )}

      {finished ? (
        <ResultScreen
          time={elapsedTime}
          errors={input.length - correctChars}
          mode={mode}
        />
      ) : showCountdown ? (
        <Countdown onCountdownFinish={handleCountdownFinish} />
      ) : (
        <>
          <h1 className="text-3xl font-bold capitalize">{mode} match</h1>
          <Timer />
          <GameText target={targetText} input={input} />
          <ProgressBar progress={progress} />
        </>
      )}
    </div>
  )
}
