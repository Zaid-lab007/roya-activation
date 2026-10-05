import { motion } from 'framer-motion'
import { ExperienceCard } from '../components/ExperienceCard'
import { experiences, type ExperienceId } from '../data/experiences'
import './Select.css'

type SelectProps = {
  onSelect: (id: ExperienceId) => void
  onHome: () => void
}

export function Select({ onSelect, onHome }: SelectProps) {
  return (
    <section className="screen select">
      <img src="/assets/bg-horizon.png" alt="" className="screen-bg blurred" />
      <div className="screen-scrim" />
      <div className="screen-content select__content">
        <motion.div
          className="select__header"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
          <img src="/assets/logo-roya.png" alt="Roya" className="logo-roya" />
          <h1 className="screen-title">Select an experience</h1>
        </motion.div>

        <div className="select__cards">
          {experiences.map((experience, index) => (
            <ExperienceCard
              key={experience.id}
              experience={experience}
              index={index}
              onSelect={onSelect}
            />
          ))}
        </div>
      </div>

      <motion.button
        type="button"
        className="nav-fab glass-surface"
        onClick={onHome}
        aria-label="Home"
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.45 }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.96 }}
      >
        <img src="/assets/icon-home.png" alt="" />
      </motion.button>
    </section>
  )
}
