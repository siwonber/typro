'use client'
import FriendRequests from './FriendRequests'

export default function FriendRequestsModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-surface p-6 rounded-xl w-full max-w-md shadow-xl relative">
        <FriendRequests />
        <button onClick={onClose} className="absolute top-2 right-3 text-sm text-muted hover:text-text">✕</button>
      </div>
    </div>
  )
}
