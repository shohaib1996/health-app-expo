# Hunch — Mobile

React Native (Expo, SDK 57) client for **Hunch**, a self-tracking app that
finds patterns in sleep, movement and mood, then runs two-week n-of-1
experiments and returns an honest verdict — including when it didn't work.

Companion backend: `../HUNCH-FAST-API` (FastAPI, `docs/` there is the
canonical product/architecture spec this app follows screen-for-screen).

## Stack

- **Expo SDK 57**, Expo Router (file-based navigation), TypeScript strict
- **NativeWind + Tailwind**, tokens mapped 1:1 from the Nocturne design
  system (`src/design/tokens.ts` / `tailwind.config.js`) — dark-only,
  accent (`#9184d9`) reserved for "the data supports this," never decoration
- **Redux Toolkit** + `redux-persist` — session/onboarding/settings state only
- **expo-sqlite** — the device is the source of truth (backend §1.1); all
  check-in data lives here first, the server is a sync target
- **axios** — one client (`src/api/client.ts`), Bearer token attach,
  single-flight 401 refresh
- **Jest** (`jest-expo`) for pure-logic unit tests, **ESLint** (flat
  config) + **Prettier**

## Getting started

```bash
npm install
cp .env.example .env        # set EXPO_PUBLIC_API_URL to your backend
npm run android              # or: npm run ios / npm run web
```

Android is the primary target (Decisions doc: Android-first launch,
iOS blocked on Apple's legal-entity requirement for healthcare apps).

## Building with EAS

`eas.json` defines three Android build profiles (`development`,
`preview` — both APK, internal distribution — and `production`, AAB,
auto-incrementing version). No iOS profile yet, matching the
Android-first decision above.

This repo has never run `eas init` — that needs an Expo account login,
which this session doesn't have. Before the first real build:

```bash
npx eas login
npx eas init            # links this project, writes extra.eas.projectId into app.json
npx eas build --profile preview --platform android
```

## Commands

```bash
npm run android / ios / web / start   # dev server
npm test                               # jest
npm run typecheck                      # tsc --noEmit
npm run lint                           # eslint .
npm run format / format:check          # prettier
npm run export -- --platform android   # production JS bundle, no native build
```

All `expo start`/`export` scripts run through `cross-env` with
`EXPO_UNSTABLE_TREE_SHAKING=1 EXPO_UNSTABLE_METRO_OPTIMIZE_GRAPH=1` —
without these, `phosphor-react-native`'s barrel import alone pulls the
entire ~1500-icon set into the bundle (1.4MB → 7.2MB was measured
directly). Every script already carries the flags; don't run `expo`
commands directly without them.

## Architecture

```
app/                    Expo Router routes (file-based)
  (tabs)/                Today / History / Settings — the 3-tab shell
  checkin/, experiment/, pattern/, ...   modal/push routes per feature
src/
  api/client.ts          the one axios instance
  db/                     SQLite client + migrations
  design/tokens.ts        source of truth for all color/type/spacing tokens
  components/ui/          shared primitives (Button, Card, HeroNumber, ...)
  features/<domain>/      per-domain: types, api client, hooks, pure rules
  store/                  Redux store, root reducer, typed hooks
  lib/                    cross-cutting helpers (dates, cn(), device id)
```

**Per-feature convention**, mirrored across every `src/features/<domain>/`:

- `<domain>Types.ts` — TypeScript types matching the backend's Pydantic
  schemas field-for-field (camelCase; `BaseSchema`'s `alias_generator`
  makes the wire format camelCase already, so no mapping layer needed)
- `<domain>Api.ts` — thin axios wrapper, one function per endpoint
- `use<Thing>.ts` — a hook exposing `{ data, loading, error, refresh }`
- `<domain>Rules.ts` — pure business logic pulled out of screens
  specifically so it's unit-testable without SQLite/network (see
  `checkinsRules.ts`, `historyRules.ts`, `verdictRules.ts`,
  `welcomeBackRules.ts`, `savedCardRules.ts`)

**Screen IDs** (`S-xx`) in code comments refer to
`../HUNCH-FAST-API/docs/Screen_and_User_Story_Spec_v0.1.md` — that spec
is the source of truth for what each screen must do; comments here
explain deviations, not the baseline behavior.

## What's real vs. not yet

Read `docs/PROGRESS.md` before extending this app — it lists what's
built, what conventions later work must match, and what's deliberately
deferred (the on-device pattern engine, push-notification scheduling,
health data integration, in-app purchases). Screens that depend on
something unbuilt say so honestly in their own UI rather than faking
a working feature.

## Testing philosophy

Business rules that can be isolated from SQLite/network are pulled into
plain functions and unit tested (see `*Rules.ts` files above, and
`src/features/safety/detector.ts` — a verbatim port of the backend's
crisis-keyword detector, with the backend's own acceptance test corpus
ported alongside it for parity). Screens themselves aren't unit tested;
verification is `tsc --noEmit` + `eslint` + `expo export --platform
android` (confirms the bundle actually resolves and builds) before
every commit.
