---
name: Supabase Auth wiring
description: How to wire email/password auth to a user's Supabase project when no native Replit connector exists, and a common credential-copy mistake to watch for.
---

There is no native Replit integration/connector for Supabase (checked via `searchIntegrations`). It must be wired manually:

- Install `@supabase/supabase-js` server-side.
- Create one admin client with the `SUPABASE_SERVICE_ROLE_KEY` (for `auth.admin.createUser`, etc.) and one anon client with `SUPABASE_ANON_KEY` (for `auth.signInWithPassword` — used to verify a user's password without needing our own bcrypt hashing).
- Request `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` as secrets via `requestEnvVar`.

**Why:** Keeping the app's own session/JWT layer (rather than trusting Supabase's returned access token as the app session) avoids Supabase's short (~1hr) token expiry causing unwanted logouts, and keeps existing frontend auth code untouched — Supabase is only used as the credential store/verifier.

**How to apply:** In register/login routes, delegate only credential creation/verification to Supabase (`auth.admin.createUser`, `auth.signInWithPassword`), then mint the app's own long-lived JWT as before for actual session handling. Store app profile data in the existing local `users` table keyed by the Supabase user UUID.

**Common gotcha:** Users often paste the wrong URL for `SUPABASE_URL` — e.g. the REST API URL (`https://xxxx.supabase.co/rest/v1/`) instead of the bare project URL (`https://xxxx.supabase.co`). This causes `AuthApiError: Invalid path specified in request URL` (404) from `supabase-js`. Fix defensively by normalizing: parse with `new URL()` and rebuild as `${protocol}//${host}` before passing to `createClient`, rather than asking the user to re-paste.
