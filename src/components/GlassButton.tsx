import type { CSSProperties, ReactNode } from 'react'
import { motion } from 'framer-motion'
import './GlassButton.css'

type GlassButtonProps = {
  children: ReactNode
  onClick?: () => void
  className?: string
  style?: CSSProperties
  variant?: 'cta' | 'glass'
  ariaLabel?: string
}

export function GlassButton({
  children,
  onClick,
  className = '',
  style,
  variant = 'glass',
  ariaLabel,
}: GlassButtonProps) {
  return (
    <motion.button
      type="button"
      className={`glass-button glass-button--${variant} ${className}`}
      style={style}
      onClick={onClick}
      aria-label={ariaLabel}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 380, damping: 22 }}
    >
      {children}
    </motion.button>
  )
}
