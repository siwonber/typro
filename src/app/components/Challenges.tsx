'use client'

import { useState, useEffect, useRef } from 'react'

interface Challenge {
  id: number
  title: string
  description: string
  text: string
}

const challenges: Challenge[] = [
  {
    id: 1,
    title: 'J I L Madness',
    description: 'Type a tricky text with many j, i, and l.',
    text: 'jill jilted jim just in july, illicitly juggling ill jellies.'
  },
  {
    id: 2,
    title: 'Quick Brown Fox',
    description: 'The classic typing challenge.',
    text: 'The quick brown fox jumps over the lazy dog.'
  },
  {
    id: 3,
    title: 'Punctuation Frenzy',
    description: 'Accurate typing of punctuation marks.',
    text: 'Wait—did you say "fast-typing," or was it "fast typing"?'
  },
  {
    id: 4,
    title: 'Number Ninja',
    description: 'Challenge your numeric typing skills.',
    text: '1234567890 times typing 0987654321 is 1219326311126352690.'
  },
  {
    id: 5,
    title: 'Tongue Twister Typing',
    description: 'Try typing this tongue twister accurately.',
    text: 'She sells seashells by the seashore; the shells she sells are surely seashells.'
  },
  {
    id: 6,
    title: 'Caps Lock Chaos',
    description: 'Master alternating uppercase letters.',
    text: 'TyPiNg WiTh AlTeRnAtInG CaPs Is QuItE ThE ChAlLeNgE!'
  }
]

export default function Challenges() {
  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(null)
  const [userInput, setUserInput] = useState('')
  const [accuracy, setAccuracy] = useState(100)
  const [completed, setCompleted] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (activeChallenge) {
      setUserInput('')
      setAccuracy(100)
      setCompleted(false)
      inputRef.current?.focus()
    }
  }, [activeChallenge])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setUserInput(value)

    const correctText = activeChallenge?.text.slice(0, value.length) || ''
    const errors = correctText.split('').filter((char, i) => char !== value[i]).length
    const accuracyCalc = 100 - (errors / correctText.length) * 100

    setAccuracy(Number(accuracyCalc.toFixed(2)))

    if (value === activeChallenge?.text) {
      setCompleted(true)
    }
  }

  return (
    <div className="p-8 space-y-6">
      {!activeChallenge ? (
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
      ) : (
        <div className="space-y-4">
          <button
            className="px-4 py-1 border border-primary rounded-full"
            onClick={() => setActiveChallenge(null)}
          >
            ← Back
          </button>

          <div className="p-4 bg-surface rounded-lg shadow-md">
            <h3 className="text-lg font-semibold">{activeChallenge.title}</h3>
            <p className="mt-2 text-muted">{activeChallenge.text}</p>

            <input
              ref={inputRef}
              value={userInput}
              onChange={handleInputChange}
              placeholder="Start typing..."
              className="w-full mt-4 px-3 py-2 rounded border border-muted bg-background focus:outline-primary"
            />

            <div className="mt-4">
              Accuracy: <strong>{accuracy}%</strong>
            </div>

            {completed && (
              <div className="mt-2 text-success font-bold">
                🎉 Challenge completed successfully!
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
