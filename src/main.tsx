import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

function blockEvent(event: Event) {
  event.preventDefault()
}

document.addEventListener('contextmenu', blockEvent)
document.addEventListener('selectstart', blockEvent)
document.addEventListener('dragstart', blockEvent)
document.addEventListener('gesturestart', blockEvent)
document.addEventListener('gesturechange', blockEvent)
document.addEventListener('gestureend', blockEvent)

document.addEventListener(
  'wheel',
  (event) => {
    if (event.ctrlKey) event.preventDefault()
  },
  { passive: false },
)

document.addEventListener(
  'touchmove',
  (event) => {
    if (event.touches.length > 1) event.preventDefault()
  },
  { passive: false },
)

document.addEventListener('keydown', (event) => {
  const zoomKey = event.key === '+' || event.key === '-' || event.key === '=' || event.key === '0'
  if ((event.ctrlKey || event.metaKey) && zoomKey) event.preventDefault()
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
