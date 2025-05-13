'use client'

import { useRouter } from 'next/navigation'
import FancyButton from '@/components/ui/FancyButton'

interface ResultScreenProps {
  time: string
  errors: number
  mode: 'ranked' | 'normal' | string
  isChallenge?: boolean
  isSuccess?: boolean
  onRetry?: () => void
}

export default function ResultScreen({
  time,
  errors,
  mode,
  isChallenge = false,
  isSuccess,
  onRetry
}: ResultScreenProps) {
  const router = useRouter()

  return (
    <div className="text-center text-2xl space-y-6">
      <h2 className="font-bold text-4xl">🏁 Finished!</h2>
      <p>⏱ Time: {time} seconds</p>
      <p>❌ Errors: {errors}</p>
      <p>🎮 Mode: {mode}</p>

      {isChallenge && (
        <div className="mt-4 text-xl">
          {isSuccess ? (
            <p className="text-success font-semibold">✅ Challenge completed!</p>
          ) : (
            <p className="text-error font-semibold">❗Challenge failed. Try again!</p>
          )}

          {onRetry && (
            <div className="mt-4">
              <FancyButton onClick={onRetry}>Retry Challenge</FancyButton>
            </div>
          )}
        </div>
      )}

      <div className="mt-6">
        <FancyButton onClick={() => router.push('/home')}>
          Back to Menu
        </FancyButton>
      </div>
    </div>
  )
}
