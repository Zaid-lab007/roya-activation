import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { ExperienceId } from './data/experiences'
import { Landing } from './screens/Landing'
import { Select } from './screens/Select'
import { Playing } from './screens/Playing'
import { Display } from './screens/Display'
import { isDisplayRoute } from './sync/displayChannel'
import './styles/global.css'

type Screen = 'landing' | 'select' | 'playing'

const screenTransition = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
}

function MainApp() {
  const [screen, setScreen] = useState<Screen>('landing')
  const [selected, setSelected] = useState<ExperienceId | null>(null)

  function goSelect() {
    setScreen('select')
  }

  function goHome() {
    setSelected(null)
    setScreen('landing')
  }

  function playExperience(id: ExperienceId) {
    setSelected(id)
    setScreen('playing')
  }

  function goBackToSelect() {
    setScreen('select')
  }

  return (
    <div className="app-root">
      <AnimatePresence mode="wait">
        {screen === 'landing' && (
          <motion.div key="landing" className="app-screen" {...screenTransition}>
            <Landing onStart={goSelect} />
          </motion.div>
        )}
        {screen === 'select' && (
          <motion.div key="select" className="app-screen" {...screenTransition}>
            <Select onSelect={playExperience} onHome={goHome} />
          </motion.div>
        )}
        {screen === 'playing' && selected && (
          <motion.div key={`playing-${selected}`} className="app-screen" {...screenTransition}>
            <Playing experienceId={selected} onBack={goBackToSelect} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function App() {
  const [displayMode, setDisplayMode] = useState(() => isDisplayRoute())

  useEffect(() => {
    function syncRoute() {
      setDisplayMode(isDisplayRoute())
    }

    window.addEventListener('hashchange', syncRoute)
    window.addEventListener('popstate', syncRoute)
    return () => {
      window.removeEventListener('hashchange', syncRoute)
      window.removeEventListener('popstate', syncRoute)
    }
  }, [])

  if (displayMode) {
    return <Display />
  }

  return <MainApp />
}
