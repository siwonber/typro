'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@lib/supabaseClient'
import Countdown from '@/components/Countdown'
import GameText from './game/GameText'
import ProgressBar from './game/ProgressBar'
import FancyButton from './ui/FancyButton'
import ResultScreen from './game/ResultScreen'

interface Challenge {
  id: string
  title: string
  description: string
  text: string
  required_accuracy: number
  time_limit: number
  badge: string
}

export default function Challenge() {
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(null)
  const [input, setInput] = useState('')
  const [startTime, setStartTime] = useState<number | null>(null)
  const [finished, setFinished] = useState(false)
  const [showCountdown, setShowCountdown] = useState(true)
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    const fetchChallenges = async () => {
      const { data, error } = await supabase.from('challenges').select('*')
      if (error) console.error('Error fetching challenges:', error)
      else setChallenges(data || [])
    }

    fetchChallenges()
  }, [])

  useEffect(() => {
    if (!finished && input.length >= (activeChallenge?.text.length || 0)) {
      handleCompletion()
    }
  }, [input, finished])

  useEffect(() => {
    if (!showCountdown && !finished) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key.length === 1 && input.length < (activeChallenge?.text.length || 0)) {
          setInput(prev => prev + e.key)
        }
        if (e.key === 'Backspace') {
          setInput(prev => prev.slice(0, -1))
        }
      }

      window.addEventListener('keydown', handleKeyDown)
      return () => window.removeEventListener('keydown', handleKeyDown)
    }
  }, [showCountdown, finished, input.length])

  const correctChars = input
    .split('')
    .filter((char, i) => char === activeChallenge?.text[i])
    .length

  const progress = activeChallenge
    ? Math.min(100, (correctChars / activeChallenge.text.length) * 100)
    : 0

  const handleCountdownFinish = () => {
    setShowCountdown(false)
    setStartTime(Date.now())
  }

  const handleCompletion = async () => {
    if (!activeChallenge || startTime === null) return

    const timeTaken = (Date.now() - startTime) / 1000
    const accuracy = Number(((correctChars / activeChallenge.text.length) * 100).toFixed(2))
    const passed =
      accuracy >= activeChallenge.required_accuracy &&
      timeTaken <= activeChallenge.time_limit

    const { data: userData } = await supabase.auth.getUser()
    const userId = userData?.user?.id
    if (!userId) return

    const { error } = await supabase.from('user_challenges').insert([
      {
        user_id: userId,
        challenge_id: activeChallenge.id,
        accuracy,
        time_taken: timeTaken,
        success: passed,
        badge: activeChallenge.badge
      }
    ])
    if (error) console.error('Error saving challenge result:', error)

    setIsSuccess(passed)
    setFinished(true)
  }

  const resetChallenge = () => {
    setInput('')
    setStartTime(null)
    setFinished(false)
    setShowCountdown(true)
    setIsSuccess(false)
  }

  const elapsedTime = startTime ? ((Date.now() - startTime) / 1000).toFixed(2) : '0.00'

  if (!activeChallenge) {
    return (
      <div className="p-8 space-y-6">
        <h1 className="text-3xl font-bold">Challenges</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {challenges.map(ch => (
            <div
              key={ch.id}
              className="bg-surface hover:bg-primary/10 p-4 rounded-xl cursor-pointer shadow-md transition-all"
              onClick={() => setActiveChallenge(ch)}
            >
              <h2 className="text-xl font-bold">{ch.title}</h2>
              <p className="opacity-80">{ch.description}</p>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center gap-6 text-text select-none relative">
      {!finished && (
        <div className="absolute top-4 right-4">
          <FancyButton onClick={() => setActiveChallenge(null)} className="text-sm px-4 py-2">
            Leave Challenge
          </FancyButton>
        </div>
      )}

      {finished ? (
        <ResultScreen
          time={elapsedTime}
          errors={input.length - correctChars}
          mode="normal"
          isChallenge
          isSuccess={isSuccess}
          onRetry={resetChallenge}
        />
      ) : showCountdown ? (
        <Countdown onCountdownFinish={handleCountdownFinish} />
      ) : (
        <>
          <h1 className="text-3xl font-bold">{activeChallenge.title}</h1>
          <p className="text-muted max-w-xl text-center">{activeChallenge.description}</p>
          <GameText target={activeChallenge.text} input={input} />
          <ProgressBar progress={progress} />
        </>
      )}
    </div>
  )
}
