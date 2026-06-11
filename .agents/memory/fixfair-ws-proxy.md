---
name: FixFair WebSocket proxy crash fix
description: WebSocket upgrade proxy must have error handlers on both ends or ECONNRESET crashes the Express process
---

When proxying Expo's HMR WebSocket, if either the client socket or Expo's proxy socket resets abruptly, Node emits an uncaught 'error' event that crashes the process.

**Fix:** Add `socket.on('error', () => {})` immediately after receiving the upgrade event, and add `proxySocket.on('error', ...)` / `socket.on('error', ...)` inside the `proxyReq.on('upgrade', ...)` callback. Wrap the `socket.write` + pipe calls in try/catch.

**Why:** Browsers disconnect WebSockets frequently during navigation/refresh, causing ECONNRESET. Without handlers this kills the whole Express server.
