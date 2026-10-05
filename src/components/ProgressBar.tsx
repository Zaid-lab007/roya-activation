import type { PointerEvent } from 'react'
import './ProgressBar.css'

type ProgressBarProps = {
  progress: number
  onSeek: (ratio: number) => void
}

export function ProgressBar({ progress, onSeek }: ProgressBarProps) {
  const clamped = Math.min(1, Math.max(0, progress))

  function handlePointer(event: PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect()
    const ratio = (event.clientX - rect.left) / rect.width
    onSeek(Math.min(1, Math.max(0, ratio)))
  }

  return (
    <div
      className="progress-bar"
      role="slider"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(clamped * 100)}
      aria-label="Video progress"
      tabIndex={0}
      onPointerDown={handlePointer}
    >
      <div className="progress-bar__fill" style={{ width: `${clamped * 100}%` }} />
    </div>
  )
}
