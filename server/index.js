try { require('dotenv').config(); } catch {}
const express = require('express');
const cors = require('cors');
const http = require('http');
const path = require('path');

const app = express();
const isDev = process.env.NODE_ENV !== 'production';
const PORT = parseInt(process.env.PORT || '5000', 10);
const EXPO_PORT = 8081;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '50mb' }));

// ── Uploaded media (recorded diagnosis videos/voice notes) ─────
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── API routes ────────────────────────────────────────────────
app.use('/api/auth',        require('./routes/auth'));
app.use('/api/profile',     require('./routes/profile'));
app.use('/api/diagnoses',   require('./routes/diagnoses'));
app.use('/api/bookings',    require('./routes/bookings'));
app.use('/api/technicians', require('./routes/technicians'));
app.use('/api/appliances',  require('./routes/appliances'));

// ── Health check ──────────────────────────────────────────────
app.get('/api/health', (req, res) => res.json({ ok: true, mode: isDev ? 'dev' : 'prod' }));

if (isDev) {
  // ── Dev: proxy everything non-/api/* to Expo bundler ─────────
  app.use((req, res) => {
    const options = {
      hostname: 'localhost',
      port: EXPO_PORT,
      path: req.url,
      method: req.method,
      headers: {
        ...req.headers,
        host: `localhost:${EXPO_PORT}`,
        origin: `http://localhost:${EXPO_PORT}`,
      },
    };

    const proxyReq = http.request(options, (proxyRes) => {
      // Strip Expo's CORS restrictions — we proxy same-origin
      const headers = { ...proxyRes.headers };
      delete headers['x-frame-options'];
      res.writeHead(proxyRes.statusCode || 200, headers);
      proxyRes.pipe(res, { end: true });
    });

    proxyReq.on('error', () => {
      if (!res.headersSent) {
        res.status(503).send(`
          <html><body style="background:#0a0f1a;color:#aaa;font-family:sans-serif;padding:40px;text-align:center">
            <h2 style="color:#00d4aa">FixFair is starting…</h2>
            <p>Expo bundler warming up. <a href="javascript:location.reload()" style="color:#00d4aa">Refresh</a></p>
          </body></html>
        `);
      }
    });

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      req.pipe(proxyReq, { end: true });
    } else {
      proxyReq.end();
    }
  });
} else {
  // ── Production: serve built Expo web app ─────────────────────
  const distPath = path.join(__dirname, '..', 'dist');
  app.use(express.static(distPath, { index: false }));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// ── Create HTTP server (handles WS upgrade for Expo HMR) ─────
const server = http.createServer(app);

if (isDev) {
  server.on('upgrade', (req, socket, head) => {
    // Prevent uncaught ECONNRESET from crashing the process
    socket.on('error', () => {});

    const proxyReq = http.request({
      hostname: 'localhost',
      port: EXPO_PORT,
      path: req.url,
      method: req.method,
      headers: { ...req.headers, host: `localhost:${EXPO_PORT}` },
    });

    proxyReq.on('upgrade', (proxyRes, proxySocket, proxyHead) => {
      proxySocket.on('error', () => { try { socket.destroy(); } catch {} });
      socket.on('error', () => { try { proxySocket.destroy(); } catch {} });

      try {
        const headers = ['HTTP/1.1 101 Switching Protocols'];
        Object.entries(proxyRes.headers).forEach(([k, v]) => headers.push(`${k}: ${v}`));
        socket.write(headers.join('\r\n') + '\r\n\r\n');
        if (proxyHead && proxyHead.length) proxySocket.unshift(proxyHead);
        proxySocket.pipe(socket, { end: true });
        socket.pipe(proxySocket, { end: true });
      } catch {}
    });

    proxyReq.on('error', () => { try { socket.destroy(); } catch {} });
    proxyReq.end();
  });
}

server.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🔧 FixFair API   → http://localhost:${PORT}/api`);
  if (isDev) console.log(`🌐 App preview  → http://localhost:${PORT} (proxied from Expo:${EXPO_PORT})`);
  else       console.log(`🚀 Serving built app from /dist`);
});
