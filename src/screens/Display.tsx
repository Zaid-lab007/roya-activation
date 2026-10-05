import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { getExperience, type ExperienceId } from '../data/experiences'
import {
  postDisplayEvent,
  subscribeDisplayCommands,
  type DisplayCommand,
} from '../sync/displayChannel'
import './Display.css'

export function Display() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [experienceId, setExperienceId] = useState<ExperienceId | null>(null)
  const [idle, setIdle] = useState(true)

  useEffect(() => {
    postDisplayEvent({ type: 'ready' })
  }, [])

  useEffect(() => {
    return subscribeDisplayCommands((command: DisplayCommand) => {
      const video = videoRef.current

      if (command.type === 'play') {
        setExperienceId(command.experienceId)
        setIdle(false)
        return
      }

      if (command.type === 'stop') {
        if (video) {
          video.pause()
          video.removeAttribute('src')
          video.load()
        }
        setExperienceId(null)
        setIdle(true)
        postDisplayEvent({
          type: 'status',
          experienceId: null,
          paused: true,
          currentTime: 0,
          duration: 0,
          progress: 0,
        })
        return
      }

      if (!video) return

      if (command.type === 'pause') {
        video.pause()
      }

      if (command.type === 'resume') {
        video.play().catch(() => undefined)
      }

      if (command.type === 'seek') {
        video.currentTime = command.time
      }

      if (command.type === 'seekRatio' && video.duration) {
        video.currentTime = command.ratio * video.duration
      }

      if (command.type === 'ping') {
        postDisplayEvent({ type: 'ready' })
      }
    })
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video || !experienceId) return

    const experience = getExperience(experienceId)
    video.src = experience.video
    video.currentTime = 0
    video.play().catch(() => undefined)

    function emitStatus() {
      if (!video) return
      const duration = video.duration || 0
      postDisplayEvent({
        type: 'status',
        experienceId,
        paused: video.paused,
        currentTime: video.currentTime,
        duration,
        progress: duration ? video.currentTime / duration : 0,
      })
    }

    function onEnded() {
      if (!experienceId) return
      postDisplayEvent({ type: 'ended', experienceId })
      emitStatus()
    }

    video.addEventListener('timeupdate', emitStatus)
    video.addEventListener('play', emitStatus)
    video.addEventListener('pause', emitStatus)
    video.addEventListener('ended', onEnded)
    emitStatus()

    return () => {
      video.removeEventListener('timeupdate', emitStatus)
      video.removeEventListener('play', emitStatus)
      video.removeEventListener('pause', emitStatus)
      video.removeEventListener('ended', onEnded)
    }
  }, [experienceId])

  return (
    <div className="display-root">
      <video
        ref={videoRef}
        className="display-video"
        playsInline
        muted
        autoPlay
        controls={false}
      />

      {idle && (
        <motion.div
          className="display-idle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <img src="/assets/logo-roya.png" alt="Roya" className="display-idle__logo" />
          <p className="display-idle__hint">Waiting for main display</p>
        </motion.div>
      )}
    </div>
  )
}
