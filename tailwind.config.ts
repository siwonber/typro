import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        accent: 'var(--color-accent)',
        background: 'var(--color-background)',
        surface: 'var(--color-surface)',
        text: 'var(--color-text)',
        muted: 'var(--color-muted)',
        success: 'var(--color-success)',
        error: 'var(--color-error)',
        rank: {
          bronze: 'var(--rank-bronze)',
          silver: 'var(--rank-silver)',
          gold: 'var(--rank-gold)',
          platinum: 'var(--rank-platinum)',
          diamond: 'var(--rank-diamond)',
        }
      },
      fontFamily: {
        sans: ['var(--font-mono)', 'monospace'], 
        mono: ['var(--font-mono)', 'monospace'], 
      },
    },
  },
  plugins: [],
}
export default config
