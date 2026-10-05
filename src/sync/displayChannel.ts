import type { ExperienceId } from '../data/experiences'

export const DISPLAY_CHANNEL = 'roya-activation-display'

export type DisplayCommand =
  | { type: 'play'; experienceId: ExperienceId }
  | { type: 'pause' }
  | { type: 'resume' }
  | { type: 'seek'; time: number }
  | { type: 'seekRatio'; ratio: number }
  | { type: 'stop' }
  | { type: 'ping' }

export type DisplayEvent =
  | {
      type: 'status'
      experienceId: ExperienceId | null
      paused: boolean
      currentTime: number
      duration: number
      progress: number
    }
  | { type: 'ready' }
  | { type: 'ended'; experienceId: ExperienceId }

function getChannel(): BroadcastChannel | null {
  if (typeof BroadcastChannel === 'undefined') return null
  return new BroadcastChannel(DISPLAY_CHANNEL)
}

export function postDisplayCommand(command: DisplayCommand) {
  const channel = getChannel()
  if (!channel) return
  channel.postMessage(command)
  channel.close()
}

export function subscribeDisplayCommands(handler: (command: DisplayCommand) => void) {
  const channel = getChannel()
  if (!channel) return () => undefined

  const onMessage = (event: MessageEvent<DisplayCommand>) => {
    if (!event.data?.type) return
    handler(event.data)
  }

  channel.addEventListener('message', onMessage)
  return () => {
    channel.removeEventListener('message', onMessage)
    channel.close()
  }
}

export function postDisplayEvent(event: DisplayEvent) {
  const channel = getChannel()
  if (!channel) return
  channel.postMessage(event)
  channel.close()
}

export function subscribeDisplayEvents(handler: (event: DisplayEvent) => void) {
  const channel = getChannel()
  if (!channel) return () => undefined

  const onMessage = (event: MessageEvent<DisplayEvent>) => {
    if (!event.data?.type) return
    if (event.data.type === 'status' || event.data.type === 'ready' || event.data.type === 'ended') {
      handler(event.data)
    }
  }

  channel.addEventListener('message', onMessage)
  return () => {
    channel.removeEventListener('message', onMessage)
    channel.close()
  }
}

export function isDisplayRoute() {
  const hash = window.location.hash.replace(/^#\/?/, '')
  const path = window.location.pathname.replace(/\/+$/, '')
  return hash === 'display' || path.endsWith('/display')
}
