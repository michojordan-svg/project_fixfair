---
name: FixFair dev architecture
description: How the dev server is structured — single port, proxy pattern, no external proxy packages
---

Express runs on port 5000 (the Replit external port). Expo Metro bundler runs on port 8081 (internal only).
`server/dev.js` spawns both. `server/index.js` proxies all non-`/api/*` requests to Expo using Node's built-in `http` module.

**Why:** `http-proxy-middleware` is security-blocked in Replit. Built-in `http.request()` proxy works fine.

**How to apply:** Any change to the proxy logic lives in `server/index.js` inside the `if (isDev)` block. Production serves `/dist` static files instead.

Key detail: `lib/api.ts` uses `window.location.origin + '/api'` — always same-origin, works in both dev and prod.
