# Convert StudioLot To React

## Goal
Rebuild the original StudioLot concept demo as a `Vite + React JS` single-page experience that preserves the current concept, flows, and behaviors while upgrading the visual system, motion, responsiveness, and overall presentation quality.

## Migration Plan
1. Keep the legacy files in place as reference while the new React app is built beside them.
2. Copy the still-used media into `public/assets` so the React app can reference stable public URLs.
3. Build the React shell with four scenes:
   - `Home`
   - `Cloud Library`
   - `Online Player`
   - `Messages & Notifications`
4. Replace inline DOM scripting with component state, props, and small hooks.
5. Open directly into the main StudioLot shell with no password or access gate.
6. Rebuild the custom player so no major concept is lost.
7. Keep the YouTube reference-search feature live, but move the key to `VITE_YOUTUBE_API_KEY`.
8. Apply a premium cinematic redesign after behavior parity is established.

## Behavior Inventory Checklist
- [ ] The React demo opens directly into the main StudioLot experience with no password prompt
- [ ] Footer navigation switches between the four concept areas
- [ ] Home scene preserves the core StudioLot product framing
- [ ] Cloud Library preserves the reference-import / search concept
- [ ] Online Player preserves video playback, seeking, markers, comments, cue-triggered secondary audio, and share flow
- [ ] Messages scene preserves the centralized communication / notification concept
- [ ] Dialogue and music can be controlled independently
- [ ] Timeline interaction remains a first-class part of the experience
- [ ] The new UI is visibly more polished without discarding the original ideas
- [ ] Mobile and tablet layouts remain readable and usable

## Public Interfaces
- `VITE_YOUTUBE_API_KEY`: live YouTube Data API key for the Cloud Library reference search

## Implementation Notes
- Legacy source has been retired from the active project folder.
- New app entrypoint:
  - `index.html`
  - `src/main.jsx`
  - `src/App.jsx`
- Static demo media lives under:
  - `public/assets`

## Acceptance Notes
- Preserve intent over pixel matching.
- Replace low-quality legacy mechanics with cleaner equivalents where needed.
- Treat the YouTube search as demo-only client behavior for now.
