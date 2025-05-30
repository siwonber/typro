'use client'
import { useState } from 'react'
import { createPortal } from 'react-dom'
import { addFriend } from '@/hooks/friends'

type Props = { onClose: () => void }

export default function AddFriendModal({ onClose }: Props) {
  const [username, setUsername] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleAdd = async () => {
    setLoading(true)
    setMessage('')
    setSuccess(false)

    try {
      const res = await fetch('/api/getUserByUsername?username=' + encodeURIComponent(username))
      const data = await res.json()

      if (!data?.id) {
        setMessage('❌ User not found.')
        return
      }

      await addFriend(data.id)
      setMessage('✅ Friend request sent!')
      setSuccess(true)
    } catch (err: any) {
      const msg = err?.message || 'Unknown error'
      // if (msg.includes('pending')) console.warn('Request pending')
      if (msg.includes('pending')) {
        setMessage('⚠️ Friend request already sent.')
      } else if (msg.includes('already friends')) {
        setMessage('⚠️ You are already friends.')
      } else {
        setMessage('❌ ' + msg)
      }
    } finally {
      setLoading(false)
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm text-[1.6rem] leading-relaxed">
      <div className="relative w-full max-w-sm bg-surface p-8 rounded-3xl shadow-2xl text-text">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add Friend</h2>
          <button
            onClick={onClose}
            className="text-2xl text-muted hover:text-primary transition-colors"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <input
          type="text"
          placeholder="Enter username"
          className="w-full px-4 py-2 rounded-lg border border-muted bg-background text-base mb-3"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={loading || success}
        />
        <button
          onClick={handleAdd}
          disabled={loading || success}
          className="w-full bg-primary text-white py-2 rounded-lg hover:opacity-90 transition-all"
        >
          {loading ? 'Sending...' : success ? 'Sent!' : 'Send Request'}
        </button>
        {message && <p className="mt-2 text-sm">{message}</p>}
        <button
          onClick={onClose}
          className="mt-4 text-sm text-muted underline hover:text-text"
        >
          Close
        </button>
      </div>
    </div>,
    document.body
  )
}
