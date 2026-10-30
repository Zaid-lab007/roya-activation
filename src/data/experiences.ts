export type ExperienceId = 'seek' | 'steer' | 'stream' | 'scan'

export type Experience = {
  id: ExperienceId
  label: string
  wordmark: string
  video: string
}

export const idleVideo = '/videos/NESR_Intro_Video_Final.mp4'

export const experiences: Experience[] = [
  {
    id: 'seek',
    label: 'RoyaSeek',
    wordmark: '/assets/wordmark-seek.png',
    video: '/videos/ROYASEEK_FINAL_VIDEO.mp4',
  },
  {
    id: 'steer',
    label: 'RoyaSteer',
    wordmark: '/assets/wordmark-steer.png',
    video: '/videos/ROYASTEER_FINAL_VIDEO.mp4',
  },
  {
    id: 'stream',
    label: 'RoyaStream',
    wordmark: '/assets/wordmark-stream.png',
    video: '/videos/ROYASTREAM_FINAL_VIDEO.mp4',
  },
  {
    id: 'scan',
    label: 'RoyaScan',
    wordmark: '/assets/wordmark-scan.png',
    video: '/videos/ROYASCAN_FINAL_VIDEO.mp4',
  },
]

export function getExperience(id: ExperienceId): Experience {
  const found = experiences.find((item) => item.id === id)
  if (!found) throw new Error(`Unknown experience: ${id}`)
  return found
}
