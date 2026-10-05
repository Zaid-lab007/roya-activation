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

## Replace placeholder videos

Use portrait HD (1080×1920) when possible:

- `public/videos/seek.mp4`
- `public/videos/steer.mp4`
- `public/videos/stream.mp4`

## Stack

- Vite + React + TypeScript
- Framer Motion
- CSS design tokens
- BroadcastChannel dual-screen sync
