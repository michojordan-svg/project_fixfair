---
name: FixFair Expo CORS fix when proxying
description: Expo's CorsMiddleware checks origin/host headers — must override them in the proxy or requests get rejected
---

Expo's `CorsMiddleware` (`@expo/cli/src/start/server/middleware/CorsMiddleware.ts`) rejects requests whose origin doesn't match the Expo dev server's own origin.

When proxying from Express (which receives requests from the Replit domain), the origin header is the Replit domain — Expo rejects it.

**Fix:** In the proxy options, override both `host` and `origin` headers:
```js
headers: {
  ...req.headers,
  host: `localhost:${EXPO_PORT}`,
  origin: `http://localhost:${EXPO_PORT}`,
}
```

**Why:** Makes Expo think the request originated from itself. Safe to do because Express is the only caller of Expo in dev.
