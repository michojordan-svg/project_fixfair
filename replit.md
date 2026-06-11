# FixFair

Transparent, video-first home repair platform. Users record short videos of household problems, get AI-powered diagnosis with fixed pricing, and book verified technicians.

## Stack

- **Frontend**: Expo ~52 / expo-router ~4 / React Native Web (TypeScript)
- **Backend**: Node.js + Express (port 5000 in dev/prod, 3001 is not used)
- **Database**: PostgreSQL (Replit-managed, `DATABASE_URL` env var)
- **Auth**: JWT (`JWT_SECRET` env var, defaults to dev secret)
- **AI**: OpenAI gpt-4o-mini (`OPENAI_API_KEY` env var) with smart category-based fallback

## Architecture

**Development** (`node server/dev.js`):
- Launches Expo on :8081 and Express on :5000
- Express proxies all non-`/api/*` traffic to Expo bundler
- Single port (5000) exposed — no CORS issues

**Production** (`NODE_ENV=production node server/index.js`):
- Express serves built `/dist` static files + `/api/*` routes
- Build: `npm run build` → `expo export --platform web --output-dir dist`

## Key Files

- `server/index.js` — Express API + dev proxy + prod static serving
- `server/dev.js` — Dev launcher (spawns both Expo + Express)
- `server/routes/` — auth, profile, diagnoses, bookings, technicians
- `server/services/ai.js` — OpenAI integration with fallback
- `server/db.js` — PostgreSQL pool
- `lib/api.ts` — Typed frontend API client (auto-detects base URL)
- `contexts/AuthContext.tsx` — JWT auth state
- `contexts/UserContext.tsx` — App-wide user data (calls real API)

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes (auto-set) | PostgreSQL connection string |
| `JWT_SECRET` | Recommended | JWT signing secret |
| `OPENAI_API_KEY` | Optional | Real AI diagnosis (falls back to smart mock) |

## Running Locally

```bash
node server/dev.js   # starts both Expo + Express
```

## User Preferences

- Keep TypeScript strict but pragmatic — avoid excessive type gymnastics
- Prefer inline styles over StyleSheet when one-off; use StyleSheet for reused styles
- Dark theme throughout — `theme.bg = '#0a0f1a'`, `theme.accent = '#00d4aa'`
