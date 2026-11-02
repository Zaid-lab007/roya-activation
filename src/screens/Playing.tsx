import { useEffect, useRef, useState } from 'react'
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

const frameEase = [0.22, 1, 0.36, 1] as const

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00'
  const total = Math.floor(seconds)
  const minutes = Math.floor(total / 60)
  const rest = total % 60
  return `${minutes}:${rest.toString().padStart(2, '0')}`
}

/** Keep the small-screen preview locked to the big display without stuttering. */
function mirrorPlayback(video: HTMLVideoElement | null, time: number, paused: boolean) {
  if (!video) return

  if (video.readyState >= 2 && Number.isFinite(time) && Math.abs(video.currentTime - time) > 0.75) {
    video.currentTime = time
  }

  if (paused) {
    if (!video.paused) video.pause()
  } else if (video.paused) {
    void video.play().catch(() => undefined)
  }
}

export function Playing({ experienceId, onBack }: PlayingProps) {
  const experience = getExperience(experienceId)
  const [paused, setPaused] = useState(false)
  const [progress, setProgress] = useState(0)
  const [clock, setClock] = useState({ currentTime: 0, duration: 0 })
  const previewRef = useRef<HTMLVideoElement>(null)
  const hasDisplayRef = useRef(false)
  const onBackRef = useRef(onBack)
  onBackRef.current = onBack

  useEffect(() => {
    setProgress(0)
    setPaused(false)
    setClock({ currentTime: 0, duration: 0 })
    postDisplayCommand({ type: 'play', experienceId })

    return () => {
      postDisplayCommand({ type: 'stop' })
    }
  }, [experienceId])

  useEffect(() => {
    postDisplayCommand({ type: 'ping' })

    return subscribeDisplayEvents((event) => {
      if (event.type === 'ready') {
        hasDisplayRef.current = true
        postDisplayCommand({ type: 'play', experienceId })
      }

      if (event.type === 'status') {
        hasDisplayRef.current = true
        setPaused(event.paused)
        setProgress(event.progress)
        setClock({ currentTime: event.currentTime, duration: event.duration })
        mirrorPlayback(previewRef.current, event.currentTime, event.paused)
      }

      if (event.type === 'ended' && event.experienceId === experienceId) {
        onBackRef.current()
      }
    })
  }, [experienceId])

  function togglePlay() {
    const video = previewRef.current

    if (paused) {
      postDisplayCommand({ type: 'resume' })
      setPaused(false)
      void video?.play().catch(() => undefined)
    } else {
      postDisplayCommand({ type: 'pause' })
      setPaused(true)
      video?.pause()
    }
  }

  function handleSeek(ratio: number) {
    postDisplayCommand({ type: 'seekRatio', ratio })
    setProgress(ratio)

    const video = previewRef.current
    const duration = video?.duration
    if (video && duration && Number.isFinite(duration)) {
      const time = ratio * duration
      video.currentTime = time
      setClock((current) => ({ ...current, currentTime: time }))
    }
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
        <div className="playing__stage">
          <div className="playing__console">
            <motion.div
              className="playing__header"
              initial={{ opacity: 0, y: -14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: frameEase }}
            >
              <img src="/assets/logo-roya.png" alt="Roya" className="logo-roya playing__logo" />
              <h1 className="screen-title playing__title">Now Playing</h1>
            </motion.div>

            <motion.button
              type="button"
              className="playing__card glass-surface"
              onClick={togglePlay}
              aria-label={paused ? 'Play' : 'Pause'}
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.12, duration: 0.6, ease: frameEase }}
              whileHover={{ scale: 1.02 }}
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
                className={
                  experience.id === 'scan'
                    ? 'playing__wordmark playing__wordmark--scan'
                    : 'playing__wordmark'
                }
              />
            </motion.button>

            <motion.div
              className="playing__progress-wrap"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5, ease: frameEase }}
            >
              <ProgressBar progress={progress} onSeek={handleSeek} />
              <div className="playing__meta">
                <span>{formatTime(clock.currentTime)}</span>
                <span>{formatTime(clock.duration)}</span>
              </div>
            </motion.div>
          </div>

          <motion.div
            className="playing__stage-media"
            initial={{ opacity: 0, x: 48, scale: 0.94 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.8, ease: frameEase }}
          >
            <div className="playing__frame">
              <div className="playing__frame-inner">
                <video
                  ref={previewRef}
                  className="playing__video"
                  src={experience.video}
                  muted
                  playsInline
                  autoPlay
                  preload="auto"
                  aria-hidden="true"
                  tabIndex={-1}
                  onLoadedMetadata={(event) => {
                    const duration = event.currentTarget.duration
                    setClock({ currentTime: 0, duration: Number.isFinite(duration) ? duration : 0 })
                  }}
                  onTimeUpdate={(event) => {
                    const video = event.currentTarget
                    const duration = video.duration
                    if (!Number.isFinite(duration) || duration <= 0) return
                    setClock({ currentTime: video.currentTime, duration })
                    setProgress(video.currentTime / duration)
                  }}
                  onEnded={() => {
                    // Standalone preview (no display window listening): close the loop ourselves.
                    // With a live display we let its own `ended` event drive the exit.
                    if (!hasDisplayRef.current) handleBack()
                  }}
                />
                <span className="playing__badge">
                  <span className="playing__badge-dot" aria-hidden />
                  Live
                </span>
                <span className="playing__sheen" aria-hidden />
              </div>
            </div>
            <p className="playing__media-caption">Mirroring the display</p>
          </motion.div>
        </div>
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
