---
name: FixFair app architecture
description: Stack, data flow, key files, and conventions used across the project.
---

**Stack:** Expo ~52 / expo-router ~4 / React Native 0.76.6 / TypeScript / web-only mode (port 5000)

**Data flow:** `UserContext` (`contexts/UserContext.tsx`) is the single source of truth. All screens import `useUser()`. Data persisted with `window.localStorage` (no AsyncStorage installed). No backend.

**Key interfaces exported from UserContext:** `UserProfile`, `Job` (has optional `eta`, `review`), `Appliance`, `Reminder`, `DiagnosisRecord`.

**Screens wired to context:** index, diagnose, jobs, inventory, profile, tracking, booking. Community is self-contained.

**Why localStorage over AsyncStorage:** AsyncStorage is not installed; localStorage works for Expo web.

**How to apply:** Any new screen needing user data should import `useUser()`. Do not add hardcoded data arrays that duplicate what's in context.
