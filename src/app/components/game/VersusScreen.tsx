'use client'

import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

interface VersusScreenProps {
  player: {
    name: string
    avatarUrl: string
  }
  opponent: {
    name: string
    avatarUrl: string
  }
  onFinish: () => void
}

export default function VersusScreen({ player, opponent, onFinish }: VersusScreenProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
        className="fixed inset-0 bg-black flex items-center justify-center z-50 text-white"
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-5xl px-8 flex items-center justify-between relative"
        >
          {/* Left player */}
          <div className="flex flex-col items-center gap-4">
            <Image
              src={player.avatarUrl}
              alt="Player Avatar"
              width={120}
              height={120}
              className="rounded-full border-4 border-primary shadow-lg"
            />
            <h2 className="text-2xl font-bold">{player.name}</h2>
          </div>

          {/* VS Label */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
            className="text-6xl font-extrabold text-accent drop-shadow-md"
          >
            VS
          </motion.div>

          {/* Right player */}
          <div className="flex flex-col items-center gap-4">
            <Image
              src={opponent.avatarUrl}
              alt="Opponent Avatar"
              width={120}
              height={120}
              className="rounded-full border-4 border-accent shadow-lg"
            />
            <h2 className="text-2xl font-bold">{opponent.name}</h2>
          </div>
        </motion.div>

        {/* Auto-finish in 3 seconds */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 3, ease: 'linear' }}
          className="absolute bottom-0 left-0 h-1 bg-primary"
          onAnimationComplete={onFinish}
        />
      </motion.div>
    </AnimatePresence>
  )
}
