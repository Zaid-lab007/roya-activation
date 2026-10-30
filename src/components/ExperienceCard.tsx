import { motion } from 'framer-motion'
import type { Experience } from '../data/experiences'
import './ExperienceCard.css'

type ExperienceCardProps = {
  experience: Experience
  index: number
  onSelect: (id: Experience['id']) => void
}

export function ExperienceCard({ experience, index, onSelect }: ExperienceCardProps) {
  return (
    <motion.button
      type="button"
      className="experience-card"
      onClick={() => onSelect(experience.id)}
      aria-label={`Play ${experience.label}`}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 + index * 0.12, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.045, y: -6 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="experience-card__overlay" aria-hidden />
      <div className="experience-card__content">
        <img src="/assets/icon-play.svg" alt="" className="experience-card__play" />
        <img
          src={experience.wordmark}
          alt={experience.label}
          className={
            experience.id === 'scan'
              ? 'experience-card__wordmark experience-card__wordmark--scan'
              : 'experience-card__wordmark'
          }
        />
      </div>
    </motion.button>
  )
}
