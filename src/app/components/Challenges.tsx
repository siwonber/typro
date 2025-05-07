'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase } from '@lib/supabaseClient'
import Countdown from './Countdown'
import ResultPopup from './ResultPopup'

interface Challenge {
  id: string
  title: string
  description: string
  text: string
  required_accuracy: number
  time_limit: number
  badge: string // Badge-Feld hinzugefügt
}

export default function Challenge() {
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(null)
  const [userInput, setUserInput] = useState('')
  const [accuracy, setAccuracy] = useState(100)
  const [completed, setCompleted] = useState(false)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [isTyping, setIsTyping] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)

  // Fetch challenges from Supabase
  const fetchChallenges = async () => {
    try {
      const { data, error } = await supabase.from('challenges').select('*')
      if (error) throw error
      setChallenges(data || [])
    } catch (error) {
      console.error('Error fetching challenges:', error)
    }
  }

  useEffect(() => {
    fetchChallenges()
  }, [])

  useEffect(() => {
    if (activeChallenge) {
      setUserInput('')
      setAccuracy(100)
      setCompleted(false)
      setIsTyping(false)
    }
  }, [activeChallenge])

  const startChallenge = () => {
    setIsTyping(true)
    setStartTime(Date.now())
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setUserInput(value)

    if (!isTyping) return

    const correctText = activeChallenge?.text.slice(0, value.length) || ''
    const errors = correctText.split('').filter((char, i) => char !== value[i]).length
    const accuracyCalc = 100 - (errors / correctText.length) * 100

    setAccuracy(Number(accuracyCalc.toFixed(2)))

    if (value === activeChallenge?.text) {
      handleCompletion(true)
    }
  }

  const handleCompletion = async (success: boolean) => {
    if (!activeChallenge) return

    const timeTaken = startTime ? (Date.now() - startTime) / 1000 : 0

    // Fetching current user
    const { data: userData } = await supabase.auth.getUser()

    if (!userData?.user) {
      console.error('User not logged in')
      return
    }

    const userId = userData.user.id

    const { data, error } = await supabase.from('user_challenges').insert([{
      user_id: userId,                     // Benutzer-ID
      challenge_id: activeChallenge.id,    // Challenge-ID
      accuracy,                            // Genauigkeit
      time_taken: timeTaken,                // Zeit
      success,                             // Erfolg (ob die Challenge abgeschlossen wurde)
      badge: activeChallenge.badge         // Badge der Challenge
    }])

    if (error) {
      console.error('Error saving challenge result:', error)
    }

    setCompleted(true)
    setShowPopup(true)
    setIsSuccess(success && accuracy >= (activeChallenge?.required_accuracy || 0) && timeTaken <= (activeChallenge?.time_limit || 0))
  }

  const handlePopupClose = () => {
    setShowPopup(false)
    setActiveChallenge(null)
  }

  return (
    <div className="p-8 space-y-6">
      {!activeChallenge ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {challenges.map(ch => (
            <div key={ch.id}
              className="bg-surface hover:bg-primary/10 p-4 rounded-xl cursor-pointer shadow-md transition-all"
              onClick={() => setActiveChallenge(ch)}>
              <h2 className="text-xl font-bold">{ch.title}</h2>
              <p className="opacity-80">{ch.description}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <button className="px-4 py-1 border border-primary rounded-full" onClick={() => setActiveChallenge(null)}>
            ← Back
          </button>

          <div className="p-4 bg-surface rounded-lg shadow-md">
            <h3 className="text-lg font-semibold">{activeChallenge.title}</h3>
            <p className="mt-2 text-muted">{activeChallenge.text}</p>

            {/* Start Countdown */}
            {!isTyping ? (
              <Countdown onCountdownFinish={startChallenge} />
            ) : (
              <input ref={inputRef} value={userInput} onChange={handleInputChange} placeholder="Start typing..."
                className="w-full mt-4 px-3 py-2 rounded border border-muted bg-background focus:outline-primary" />
            )}

            <div className="mt-4">
              Accuracy: <strong>{accuracy}%</strong>
            </div>
          </div>
        </div>
      )}

      {/* Popup for result */}
      {showPopup && (
        <ResultPopup
          accuracy={accuracy}
          timeTaken={((Date.now() - startTime!) / 1000)}
          onClose={handlePopupClose}
          isSuccess={isSuccess}
        />
      )}
    </div>
  )
}
