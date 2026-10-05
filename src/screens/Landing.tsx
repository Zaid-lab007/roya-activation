import { useState } from 'react'
import { motion } from 'framer-motion'
import { GlassButton } from '../components/GlassButton'
import './Landing.css'

type LandingProps = {
  onStart: () => void
}

export function Landing({ onStart }: LandingProps) {
  const [exiting, setExiting] = useState(false)

  function handleStart() {
    if (exiting) return
    setExiting(true)
    window.setTimeout(() => onStart(), 780)
  }

  return (
    <motion.section
      className="screen landing"
      animate={exiting ? { scale: 1.08, opacity: 0, filter: 'blur(8px)' } : { scale: 1, opacity: 1, filter: 'blur(0px)' }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.img
        src="/assets/bg-horizon.png"
        alt=""
        className="screen-bg landing__bg"
        initial={{ scale: 1.04 }}
        animate={exiting ? { scale: 1.18 } : { scale: 1.1 }}
        transition={
          exiting
            ? { duration: 0.75, ease: [0.22, 1, 0.36, 1] }
            : { duration: 22, ease: 'linear', repeat: Infinity, repeatType: 'reverse' }
        }
      />
      <div className="screen-scrim landing__scrim" />

      <div className="landing__stage">
        <motion.div
          className="landing__hero"
          animate={exiting ? { opacity: 0, scale: 1.04, y: -12 } : { opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.img
            src="/assets/logo-roya.png"
            alt="Roya"
            className="landing__logo"
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={exiting ? { opacity: 0, y: -20 } : { opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: exiting ? 0.4 : 0.9, ease: [0.22, 1, 0.36, 1] }}
          />

          <motion.div
            className="landing__cta-wrap"
            initial={{ opacity: 0, y: 28 }}
            animate={exiting ? { opacity: 0, y: 36, scale: 0.94 } : { opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: exiting ? 0 : 0.3, duration: exiting ? 0.35 : 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <GlassButton
              variant="cta"
              className={exiting ? 'landing__cta landing__cta--pressed' : 'landing__cta'}
              onClick={handleStart}
              ariaLabel="Tap to start"
            >
              TAP TO START
            </GlassButton>
            {exiting && <span className="landing__ripple" aria-hidden />}
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  )
}
