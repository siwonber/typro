'use client'

import { useState } from 'react'
import GameText from './GameText'
import InputField from './InputField'
import Timer from './Timer'
import ProgressBar from './ProgressBar'
import ResultScreen from './ResultScreen'

const targetText = 'The quick brown fox jumps over the lazy dog.'

export default function MatchScreen({ mode }: { mode: 'ranked' | 'normal' }) {
  const [input, setInput] = useState('')
  const [startTime] = useState(Date.now())
  const [finished, setFinished] = useState(false)

  const correctChars = input
    .split('')
    .filter((char, i) => char === targetText[i]).length

  const progress = Math.min(100, (correctChars / targetText.length) * 100)

  // Spiel beendet?
  if (!finished && input === targetText) {
    setFinished(true)
  }

  const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(2)

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center gap-6 text-text">
      {finished ? (
        <ResultScreen
          time={elapsedTime}
          errors={input.length - correctChars}
          mode={mode}
        />
      ) : (
        <>
          <h1 className="text-3xl font-bold capitalize">{mode} match</h1>
          <Timer />
          <GameText target={targetText} input={input} />
          <InputField value={input} onChange={setInput} />
          <ProgressBar progress={progress} />
        </>
      )}
    </div>
  )
}
