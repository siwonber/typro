'use client'

interface ResultScreenProps {
  time: string
  errors: number
  mode: string
}

export default function ResultScreen({ time, errors, mode }: ResultScreenProps) {
  return (
    <div className="text-center text-2xl space-y-4">
      <h2 className="font-bold text-4xl">🏁 Finished!</h2>
      <p>⏱ Time: {time} seconds</p>
      <p>❌ Errors: {errors}</p>
      <p>🎮 Mode: {mode}</p>
    </div>
  )
}
