'use client'

interface ResultPopupProps {
  accuracy: number
  timeTaken: number
  onClose: () => void
  isSuccess: boolean
}

export default function ResultPopup({ accuracy, timeTaken, onClose, isSuccess }: ResultPopupProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-surface p-6 rounded-lg shadow-lg">
        <h3 className={`text-xl font-semibold ${isSuccess ? 'text-success' : 'text-error'}`}>
          {isSuccess ? '🎉 You Win!' : '😔 You Lose'}
        </h3>
        <div className="mt-4 text-text">
          <p>Accuracy: <strong>{accuracy}%</strong></p>
          <p>Time taken: <strong>{timeTaken}s</strong></p>
        </div>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-primary text-white rounded hover:opacity-80 transition-all duration-300"
        >
          Close
        </button>
      </div>
    </div>
  )
}
