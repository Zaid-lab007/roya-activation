export type ExperienceId = 'seek' | 'steer' | 'stream'

export type Experience = {
  id: ExperienceId
  label: string
  wordmark: string
  thumb: string
  video: string
}

export const experiences: Experience[] = [
  {
    id: 'seek',
    label: 'RoyaSeek',
    wordmark: '/assets/wordmark-seek.png',
    thumb: '/assets/thumb-seek.png',
    video: '/videos/Roya_Seek_2mp4.mp4',
  },
  {
    id: 'steer',
    label: 'RoyaSteer',
    wordmark: '/assets/wordmark-steer.png',
    thumb: '/assets/thumb-steer.png',
    video: '/videos/Roya_Steer_1.mp4',
  },
  {
    id: 'stream',
    label: 'RoyaStream',
    wordmark: '/assets/wordmark-stream.png',
    thumb: '/assets/thumb-stream.png',
    video: '/videos/RoyaStream_3.mp4',
  },
]

export function getExperience(id: ExperienceId): Experience {
  const found = experiences.find((item) => item.id === id)
  if (!found) throw new Error(`Unknown experience: ${id}`)
  return found
}
