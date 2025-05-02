'use client'
import { useState, useRef } from 'react'
import Image from 'next/image'
import { supabase } from '@/lib/supabaseClient'
import { createPortal } from 'react-dom'

type SettingsModalProps = {
  onClose: () => void
  currentAvatar: string
  onAvatarUpdate: (url: string) => void
}

export default function SettingsModal({ onClose, currentAvatar, onAvatarUpdate }: SettingsModalProps) {
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)

    const { data: sessionData } = await supabase.auth.getSession()
    const userId = sessionData.session?.user?.id
    if (!userId) return

    const fileExt = file.name.split('.').pop()
    const filePath = `avatars/${userId}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true })

    if (uploadError) {
      console.error(uploadError)
      setUploading(false)
      return
    }

    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath)
    const publicUrl = data.publicUrl

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: publicUrl })
      .eq('id', userId)

    if (!updateError) {
      onAvatarUpdate(publicUrl)
    }

    setUploading(false)
  }

  return createPortal(
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-surface p-6 rounded-xl shadow-xl w-full max-w-sm text-text">
        <h2 className="text-lg font-semibold mb-4">Settings</h2>

        <div className="flex flex-col items-center gap-4">
          <Image
            src={currentAvatar}
            alt="Current profile picture"
            width={100}
            height={100}
            className="rounded-full border-2 border-primary object-cover"
          />
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="bg-primary text-white px-4 py-2 rounded hover:opacity-90"
          >
            {uploading ? 'Uploading...' : 'Change profile picture'}
          </button>
        </div>

        <button
          onClick={onClose}
          className="mt-6 text-sm text-muted underline hover:text-text"
        >
          Close
        </button>
      </div>
    </div>,
    document.body
  )
}
