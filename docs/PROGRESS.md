# Progress

Read this before writing code. Updated as sections land.

## Screens built, by spec ID

Working end-to-end (real SQLite/API calls, not mocked):

- **S-01–S-06** Onboarding — welcome, what-this-isn't, age gate (month+year
  only, permanent under-17 block), focus areas (posts to `PUT
/me/focus-areas`), health-permissions and reminder-time steps are honest
  placeholders. Rendered as a plain component tree (`OnboardingFlow.tsx`),
  not routes — nothing to navigate back into.
- **S-10** Today — states 1 (check-in due) and 6 (quiet/done) wired.
  States 2/3/4 (verdict due / new experiment ready / cold-start action)
  need the on-device pattern engine, not built (see below).
- **S-11/S-12/S-13/S-14** Check-in — mood (required) → tags (optional,
  max 3) → note/voice (optional) → saved confirmation. Writes to SQLite.
  Crisis detector runs on the note before save.
- **S-16** Pattern detail, **S-17** Not enough data, **S-33** All patterns
  — real screens, will be empty until the pattern engine exists and syncs.
- **S-20/S-21/S-22** Propose → plan builder → confirmed — rules-based
  proposal (focus areas only, confirmed with the backend team's own
  `proposal_service.py` docstring — doesn't need the pattern engine).
- **S-23/S-24** Active experiment (adherence only, never an interim
  outcome) → verdict (all three types equal design weight, only "worked"
  carries the accent).
- **S-26** Install as habit, **S-27** Library browse, **S-30/S-31/S-32**
  History / day detail / backlog entry (shares the check-in flow via an
  optional `?date=` param), **S-34** Past experiments.
- **S-40/S-41** Memory — will be empty until a backend module calls
  `MemoryService.record()` (nothing does yet, per the backend's own
  `docs/PROGRESS.md`).
- **S-50–S-59** Settings and its full row list: Health connections (S-51,
  honest "not connected" placeholder), Reminders (S-52, persists a
  preference, doesn't schedule anything yet), Privacy (S-53), Export
  (S-54), Delete-your-data (S-55, type-to-confirm), Subscription (S-56),
  Account (S-57, sign-in via `/auth/link`), Help & resources (S-58),
  About (S-59).
- **S-60** Support interstitial — full crisis detector port, wired to
  every free-text field that exists so far.
- **S-70/S-71** Welcome back — short/long gap, evaluated once per cold
  start.
- **S-80** Paywall — real UI, `Start trial` states plainly that no store
  billing SDK is wired up.

## Not built, and why

| Screen/feature                               | Blocker                                                                                                                                                                            |
| -------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| S-15 cold-start action, full S-10 states 2–4 | Needs the on-device pattern engine (TypeScript, per the Decisions doc §6) — the PRD's Phase-1 gate, not yet built anywhere in this repo                                            |
| S-25 verdict share card                      | Needs a screenshot/view-capture library, not installed                                                                                                                             |
| S-61 report-this-response                    | `VerdictResponse`/`PatternResponse` carry no `ai_call_id` field — nothing in the backend's current API surface gives this screen a real trigger. Building it would ship a dead end |
| S-81 trial started                           | No real purchase flow exists to trigger it (see S-80)                                                                                                                              |
| Push notifications                           | `expo-notifications` isn't installed; S-52 persists the user's preferred time but nothing schedules against it                                                                     |
| Health Connect / HealthKit                   | S-51 is an honest placeholder; no native health SDK integrated                                                                                                                     |
| On-device audio transcription                | S-13 records real audio (stored, playable in S-31 via `VoiceNotePlayer`) but doesn't transcribe it — no STT engine chosen                                                          |

## Conventions established

- **Device is the source of truth.** SQLite (`src/db/`) holds check-ins;
  the server is a sync target. `src/features/sync/syncService.ts` pushes
  pending rows after every save and once on cold start, best-effort,
  never blocking.
- **Every API type file mirrors a backend Pydantic schema field-for-field**
  — camelCase because `BaseSchema`'s `alias_generator=to_camel` makes the
  wire format camelCase already.
- **Business rules live in pure `*Rules.ts` files**, separate from the
  hooks/screens that call them, specifically so they're unit-testable
  without SQLite or network. This is the highest-value place to add
  tests going forward — see `src/features/checkins/checkinsRules.ts` for
  the pattern.
- **Screens with no real backend data yet still render real empty
  states**, not "coming soon." An empty pattern list or memory list is
  expected, not a bug — check this doc before assuming otherwise.
- **Never fake a native integration.** Health connections, reminders and
  the paywall's purchase button all say plainly what isn't wired up
  instead of pretending. Match this when adding new screens that touch
  something unbuilt.
- **Modal vs. push presentation**: routes reached from a tab (library,
  privacy, memory, account, settings sub-pages) are `presentation:
'modal'`; routes that continue a flow already in progress (plan
  builder → confirmed → active → verdict, check-in's own steps) use the
  default push so back-navigation stays linear.
- `.venv`-equivalent here is just `npm` — nothing needs a special PATH
  entry. `npx expo install <pkg>` for any new Expo-managed native
  dependency, never plain `npm install`, so versions stay pinned to the
  SDK.

## Verification, every commit

```bash
npx tsc --noEmit
npx eslint . --max-warnings=0
npx jest
npm run export -- --platform android --output-dir <tmp>   # confirms the bundle actually resolves/builds
```

Web export currently fails on `expo-sqlite`'s wasm worker asset (a
browser-only gap in its web backend) — not a blocker, this is an
Android-first app; Android export is the real smoke test.

## Deferred (nothing blocking; all real, all named)

- Apple/Google native sign-in on `/auth/link` (email/password only today)
- `age_verified` is computed client-side but never sent to the backend —
  matches the backend's own deferred write path for that field
- Soft-deleted check-ins never propagate to the server — `SyncCheckInPush`
  has no delete operation yet, only upsert; deletions stay local-only
- No delta pull (`GET /sync/pull`) — only push is wired. A second device
  signing into the same account wouldn't currently pull existing history
  back down; only local SQLite writes and this device's own future
  syncs would populate it
