'use client'

import { useState, useEffect } from 'react'
import { SparklesIcon } from '@heroicons/react/24/outline'

interface CelebrationIconProps {
  isVisible: boolean
  className?: string
}

export default function CelebrationIcon({ isVisible, className = '' }: CelebrationIconProps) {
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (isVisible && !isAnimating) {
      setIsAnimating(true)
      // Reset animation after 2 seconds
      const timer = setTimeout(() => {
        setIsAnimating(false)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [isVisible, isAnimating])

  if (!isVisible) return null

  return (
    <div className={`relative ${className}`}>
      <SparklesIcon className={`w-5 h-5 text-yellow-500 ${
        isAnimating ? 'animate-bounce' : ''
      }`} />
      {isAnimating && (
        <div className="absolute -top-1 -right-1">
          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-ping" />
        </div>
      )}
    </div>
  )
} 