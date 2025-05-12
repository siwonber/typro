'use client'

interface GameTextProps {
  target: string
  input: string
}

export default function GameText({ target, input }: GameTextProps) {
  return (
    <div className="text-2xl font-mono text-center max-w-xl break-words">
      {target.split('').map((char, i) => {
        const isCorrect = input[i] === char
        const isWrong = input[i] && input[i] !== char
        const isCursor = i === input.length

        return (
          <span
            key={i}
            className={`${
              isCursor
                ? 'border-b-2 border-primary animate-pulse'
                : ''
            } ${
              isCorrect
                ? 'text-green-500'
                : isWrong
                ? 'text-red-500 underline'
                : 'text-muted'
            }`}
          >
            {char}
          </span>
        )
      })}
    </div>
  )
}
