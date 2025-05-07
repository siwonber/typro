'use client'

interface InputFieldProps {
  value: string
  onChange: (value: string) => void
}

export default function InputField({ value, onChange }: InputFieldProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border border-muted rounded-md px-4 py-2 w-80 text-white"
      placeholder="Type here..."
      autoFocus
    />
  )
}
