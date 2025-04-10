/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#facc15',
        accent: '#22d3ee',
        background: '#0f172a',
        surface: '#1e293b',
        text: '#ffffff',
        muted: '#64748b',
        success: '#10b981',
        error: '#ef4444',
        rank: {
          bronze: '#cd7f32',
          silver: '#c0c0c0',
          gold: '#ffd700',
          platinum: '#00bfff',
          diamond: '#b9f2ff',
        },
      },
      fontFamily: {
        sans: ['var(--font-mono)', 'monospace'],
      },
    },
  },
  plugins: [],
}
