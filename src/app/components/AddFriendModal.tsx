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
      const res = await fetch('/api/getUserByUsername?username=' + username)
      const data = await res.json()

      if (!data?.id) {
        setMessage('User not found.')
        setLoading(false)
        return
      }

      await addFriend(data.id)
      setMessage('✅ Friend request sent!')
      setSuccess(true)
    } catch (err) {
      console.error(err)
      setMessage('❌ ' + (err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return createPortal(
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-surface p-6 rounded-xl shadow-xl w-full max-w-sm text-text">
        <h2 className="text-lg font-semibold mb-4">Add Friend</h2>
        <input
          type="text"
          placeholder="Enter username"
          className="w-full px-4 py-2 rounded border border-muted bg-background mb-2"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={loading || success}
        />
        <button
          onClick={handleAdd}
          disabled={loading || success}
          className="w-full bg-primary text-white py-2 rounded hover:opacity-90"
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
