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
  
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
      console.log('Session:', sessionData)
  
      const { data: userData, error: userError } = await supabase.auth.getUser()
      console.log('UserData:', userData)
  
      if (userError || !userData?.user) throw new Error('User not authenticated.')
      const userId = userData.user.id
  
      const fileExt = file.name.includes('.') ? file.name.split('.').pop() : 'png'
      const fileName = `${userId}-${Date.now()}.${fileExt}`
      const filePath = fileName
  
      console.log('Uploading to:', filePath)
  
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          upsert: true,
          cacheControl: '3600',
          contentType: file.type
        })
  
      if (uploadError) {
        console.error('Full upload error:', uploadError)
        throw new Error('Upload failed: ' + JSON.stringify(uploadError, null, 2))
      }
  
      const publicUrl = supabase
        .storage
        .from('avatars')
        .getPublicUrl(filePath)
        .data
        .publicUrl
  
      if (!publicUrl) throw new Error('Failed to get public URL.')
  
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', userId)
  
      if (updateError) throw new Error('Failed to update profile: ' + updateError.message)
  
      onAvatarUpdate(publicUrl)
    } catch (err) {
      console.error('Avatar upload error:', err)
    } finally {
      setUploading(false)
    }
  }
  

  return createPortal(
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-surface p-6 rounded-xl shadow-xl w-full max-w-sm text-text">
        <h2 className="text-lg font-semibold mb-4">Settings</h2>

        <div className="flex flex-col items-center gap-4">
          <Image
            key={currentAvatar}
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
