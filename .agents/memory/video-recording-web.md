---
name: Video recording architecture
description: How FixFair's diagnose video capture is implemented and its scope limitations
---

FixFair's video recording (in the diagnose flow) uses browser `navigator.mediaDevices.getUserMedia` + `MediaRecorder`, not `expo-camera` — even though `expo-camera` is installed in package.json, it is unused.

**Why:** the app currently only runs/is tested as Expo Router web (React Native Web) in this environment; there's no native iOS/Android build pipeline available to test against, so native camera modules were intentionally left alone rather than half-implemented.

**How to apply:** any "make video recording production ready" type request should be scoped to the web MediaRecorder path (permissions, front/rear switch via track replacement, pause/resume, background-tab auto-pause via `visibilitychange`, review/playback step, upload via multipart to `/api/diagnoses`). If the user actually needs native mobile camera support, that requires introducing `expo-camera` usage and a native build/test loop — call this out explicitly rather than silently assuming web coverage extends to native.
