'use client'

import { useRouter } from 'next/navigation'
import FancyButton from '@/components/ui/FancyButton'

interface ResultScreenProps {
  time: string
  errors: number
  mode: string
}

export default function ResultScreen({ time, errors, mode }: ResultScreenProps) {
  const router = useRouter()

  return (
    <div className="text-center text-2xl space-y-6">
      <h2 className="font-bold text-4xl">🏁 Finished!</h2>
      <p>⏱ Time: {time} seconds</p>
      <p>❌ Errors: {errors}</p>
      <p>🎮 Mode: {mode}</p>

      <FancyButton
        onClick={() => router.push('/home')}
        className="mt-4"
      >
        Back to Menu
      </FancyButton>
    </div>
  )
}
