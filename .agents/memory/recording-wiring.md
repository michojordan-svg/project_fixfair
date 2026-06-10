---
name: Real audio/video recording in diagnose.tsx
description: How MediaRecorder + live camera preview works on Expo web.
---

**Audio:** `navigator.mediaDevices.getUserMedia({ audio: true })` → `new MediaRecorder(stream)` → blob on stop.

**Video:** Same but `{ video: { facingMode: 'environment' }, audio: true }`. Live preview: after stream is obtained, a `<video>` DOM element is created and appended to a React Native `View` ref (which maps to a `<div>` on web). Done via `setTimeout(..., 200)` to let the View render first.

**Permission denied:** Caught as `NotAllowedError` → sets `permissionDenied` state → shows banner.

**Why DOM manipulation:** Expo web renders RN Views as divs. Appending a native `<video>` element to the div ref is the cleanest way to show a live camera feed without adding expo-camera or a WebView.

**How to apply:** Any screen needing camera/mic on web should follow this pattern. Guard all MediaRecorder code with `if (Platform.OS !== 'web') return` for native safety.
