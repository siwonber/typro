'use client'
import { createPortal } from 'react-dom'
import FriendRequests from './FriendRequests'

type Props = { onClose: () => void }

export default function FriendRequestsModal({ onClose }: Props) {
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm text-[1.6rem] leading-relaxed">
      <div className="relative w-full max-w-2xl bg-surface p-10 rounded-3xl shadow-2xl text-text">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Friend Requests</h2>
          <button
            onClick={onClose}
            className="text-4xl text-muted hover:text-primary transition-colors"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <FriendRequests />
      </div>
    </div>,
    document.body
  )
}
