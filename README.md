# Roya Activation

Cinematic dual-display activation experience:

1. **Main display** — Landing → Select → Now Playing controls  
2. **Second display** — Portrait HD video playback

## Run

```bash
npm install
npm run dev
```

### Main display (landscape UI)
Open: [http://localhost:5173/](http://localhost:5173/)

### Second display (portrait video)
Open on the second monitor: [http://localhost:5173/#/display](http://localhost:5173/#/display)

Tip: drag that window to the second screen and press `F11` for fullscreen.

When you tap an experience on the main display, the video plays on the second display. Pause / seek / back on the main UI syncs over `BroadcastChannel`.

## Videos

Portrait HD (1080×1920) plays best on the second display:

- RoyaSeek — `public/videos/WhatsApp Video.mp4`
- RoyaSteer — `public/videos/WhatsApp Video 2026-10-21 at 12.33.01.mp4`
- RoyaStream — `public/videos/WhatsApp Video 2026-10-21 at 12.33.03.mp4`

## Stack

- Vite + React + TypeScript
- Framer Motion
- CSS design tokens
- BroadcastChannel dual-screen sync
