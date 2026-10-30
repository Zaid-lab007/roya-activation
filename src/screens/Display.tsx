import { useEffect, useRef, useState } from 'react'
import { getExperience, idleVideo, type ExperienceId } from '../data/experiences'
import {
  postDisplayEvent,
  subscribeDisplayCommands,
  type DisplayCommand,
} from '../sync/displayChannel'
import './Display.css'

export function Display() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const experienceIdRef = useRef<ExperienceId | null>(null)
  const [experienceId, setExperienceId] = useState<ExperienceId | null>(null)

  useEffect(() => {
    postDisplayEvent({ type: 'ready' })
  }, [])

  useEffect(() => {
    return subscribeDisplayCommands((command: DisplayCommand) => {
      const video = videoRef.current

      if (command.type === 'play') {
        experienceIdRef.current = command.experienceId
        setExperienceId(command.experienceId)
        return
      }

      if (command.type === 'stop') {
        experienceIdRef.current = null
        setExperienceId(null)
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

      if (!video || !experienceIdRef.current) return

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
    if (!video) return

    experienceIdRef.current = experienceId
    const experience = experienceId ? getExperience(experienceId) : null
    video.loop = !experience
    video.src = experience ? experience.video : idleVideo
    video.currentTime = 0
    video.play().catch(() => undefined)

    if (!experience || !experienceId) return

    const playingId = experienceId

    function emitStatus() {
      if (!video) return
      const duration = video.duration || 0
      postDisplayEvent({
        type: 'status',
        experienceId: playingId,
        paused: video.paused,
        currentTime: video.currentTime,
        duration,
        progress: duration ? video.currentTime / duration : 0,
      })
    }

    function onEnded() {
      postDisplayEvent({ type: 'ended', experienceId: playingId })
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
        src={idleVideo}
        playsInline
        muted
        autoPlay
        loop={experienceId === null}
        controls={false}
      />
    </div>
  )
}
