import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ProgressBar } from '../components/ProgressBar'
import { getExperience, type ExperienceId } from '../data/experiences'
import {
  postDisplayCommand,
  subscribeDisplayEvents,
} from '../sync/displayChannel'
import './Playing.css'

type PlayingProps = {
  experienceId: ExperienceId
  onBack: () => void
}

export function Playing({ experienceId, onBack }: PlayingProps) {
  const experience = getExperience(experienceId)
  const [paused, setPaused] = useState(false)
  const [progress, setProgress] = useState(0)
  const [displayReady, setDisplayReady] = useState(false)

  useEffect(() => {
    setProgress(0)
    setPaused(false)
    postDisplayCommand({ type: 'play', experienceId })

    return () => {
      postDisplayCommand({ type: 'stop' })
    }
  }, [experienceId])

  useEffect(() => {
    postDisplayCommand({ type: 'ping' })

    return subscribeDisplayEvents((event) => {
      if (event.type === 'ready') {
        setDisplayReady(true)
        postDisplayCommand({ type: 'play', experienceId })
      }

      if (event.type === 'status') {
        setPaused(event.paused)
        setProgress(event.progress)
        if (event.experienceId) setDisplayReady(true)
      }

      if (event.type === 'ended') {
        setPaused(true)
        setProgress(1)
      }
    })
  }, [experienceId])

  function togglePlay() {
    if (paused) {
      postDisplayCommand({ type: 'resume' })
      setPaused(false)
    } else {
      postDisplayCommand({ type: 'pause' })
      setPaused(true)
    }
  }

  function handleSeek(ratio: number) {
    postDisplayCommand({ type: 'seekRatio', ratio })
    setProgress(ratio)
  }

  function handleBack() {
    postDisplayCommand({ type: 'stop' })
    onBack()
  }

  return (
    <section className="screen playing">
      <img src="/assets/bg-horizon.png" alt="" className="screen-bg blurred" />
      <div className="screen-scrim playing__scrim" />

      <div className="screen-content playing__content">
        <motion.div
          className="playing__header"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <img src="/assets/logo-roya.png" alt="Roya" className="logo-roya" />
          <h1 className="screen-title">Now Playing</h1>
          <p className={`playing__display-status ${displayReady ? 'is-ready' : ''}`}>
            {displayReady ? 'Playing on second display' : 'Open second display to play video'}
          </p>
        </motion.div>

        <motion.button
          type="button"
          className="playing__card glass-surface"
          onClick={togglePlay}
          aria-label={paused ? 'Play' : 'Pause'}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="playing__control" aria-hidden>
            <AnimatePresence mode="wait" initial={false}>
              {paused ? (
                <motion.img
                  key="play"
                  src="/assets/icon-play.svg"
                  alt=""
                  className="playing__icon"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.18 }}
                />
              ) : (
                <motion.span
                  key="pause"
                  className="playing__pause"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.18 }}
                >
                  <span />
                  <span />
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          <img
            src={experience.wordmark}
            alt={experience.label}
            className="playing__wordmark"
          />
        </motion.button>

        <motion.div
          className="playing__progress-wrap"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <ProgressBar progress={progress} onSeek={handleSeek} />
        </motion.div>
      </div>

      <motion.button
        type="button"
        className="nav-fab glass-surface"
        onClick={handleBack}
        aria-label="Back"
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.96 }}
      >
        <img src="/assets/icon-back.png" alt="" />
      </motion.button>
    </section>
  )
}
