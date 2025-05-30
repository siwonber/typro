'use client'

import { useEffect, useRef } from 'react'

interface GameTextProps {
  target: string
  input: string
}

export default function GameText({ target, input }: GameTextProps) {
  const cursorRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (cursorRef.current) {
      cursorRef.current.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      })
    }
  }, [input])

  return (
    <div className="text-4xl font-mono text-center max-w-5xl overflow-x-auto whitespace-nowrap px-6">
      {target.split('').map((char, i) => {
        const isCorrect = input[i] === char
        const isWrong = input[i] && input[i] !== char
        const isCursor = i === input.length
        const displayChar = char === ' ' ? '␣' : char

        return (
          <span
            key={i}
            ref={isCursor ? cursorRef : null}
            className={`inline-block mx-0.5 ${
              isCursor ? 'border-b-4 border-primary animate-pulse' : ''
            } ${
              isCorrect
                ? 'text-green-400'
                : isWrong
                ? 'text-red-400 underline'
                : 'text-muted'
            } ${char === ' ' ? 'bg-muted px-1 rounded' : ''}`}
          >
            {displayChar}
          </span>
        )
      })}
    </div>
  )
}
