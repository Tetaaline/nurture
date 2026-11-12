# NURTURE final report

Prototype built in five sprints. Live at https://nurture-chi-flax.vercel.app. Code at https://github.com/Tetaaline/nurture.

## 1. Requirements built and how they were verified

"Headless checks" means a script that signed in as real Clerk test users (Parent A, Teen A, Teen B) and called the production build on localhost. "Unit tests" means `npm test` (Vitest). "Build" means `npm run build` and `npm run lint`.

| Area | Requirement | Where | Verified by |
| --- | --- | --- | --- |
| Accounts | Managed login (Clerk), no passwords stored by NURTURE | `src/proxy.ts`, `src/app/layout.tsx`, sign-in and sign-up pages | Build; live sign-in page renders; Clerk doctor passes |
| Accounts | Onboarding with display name and role; parent gets a Family row | `src/app/onboarding/*` | Code review; parent family row confirmed by linking tests; browser run-through left to the owner |
| Accounts | Role-based dashboards; other role's dashboard redirects to your own | `src/app/parent/page.tsx`, `src/app/teen/page.tsx`, `src/lib/auth.ts` | Headless: parent fetching `/teen` and `/teen/journal` receives a redirect to `/parent` |
| Accounts | Pages need a session; API routes return 401 without one | `src/lib/auth.ts`, `src/lib/http.ts` | Headless: 401 on journal, check-in, family and conversation APIs without a token; pages stream a 307 to `/sign-in` |
| Accounts | 403 for the wrong role | `requireRole` | Headless: parent gets 403 on journal and check-in APIs; teen gets 403 generating a code |
| Journal | Create, list newest first, view, edit, delete with confirm | `src/app/api/journal/*`, `src/app/teen/journal/*` | Headless: 25 API checks (201, ordering, PATCH, DELETE, 404 after delete); confirm step in `journal-entry-view.tsx` |
| Journal | Validation: title up to 100, body 1-5000, field messages, nothing saved on invalid input | `src/lib/journal.ts` | Headless: 400 with field messages for empty, blank, 101-character title, 5001-character body, malformed JSON; row count unchanged |
| Journal | Owner only; other teen gets 404; parent gets 403; no parent response contains journal text | `src/lib/journal.ts`, `requireRole` | Headless: Teen B gets 404 on read, edit and delete of Teen A's entry; parent pages rendered without entry text |
| Journal | `Cache-Control: no-store` on every journal response | `json()` in `src/lib/http.ts` | Headless: header checked |
| Journal | Privacy note "Only you can see this, not even your parent" | `src/app/teen/journal/page.tsx`, editor placeholder | Rendered page checked |
| Linking | Only a parent with no linked teen can generate; 8 characters from A-Z and 2-9 without I and O; `crypto.randomInt`; shown once with expiry | `src/lib/invite.ts`, `invite-code-panel.tsx` | Headless: format regex, 24-hour expiry, 409 once linked, 403 for teen |
| Linking | Only an HMAC-SHA-256 hash stored; plain code never stored or logged | `hashCode` | Headless: stored values are 64-character hashes not equal to the code; no code appears in any log statement |
| Linking | 24-hour expiry; one ACTIVE code per family; new code revokes old in one transaction; parent can revoke | `createInviteCode`, `revokeInviteCode` | Headless: second code revokes the first (first then fails); one ACTIVE row; DELETE revokes |
| Linking | Only a teen not in a family can redeem; trim and uppercase; one transaction; race-safe | `redeemInviteCode` | Headless: lowercase with spaces and a dash redeems; linked teen gets 409; parent gets 403; conditional updates reviewed for the race |
| Linking | Every failure shows "This code is not valid or has expired." | `INVALID_CODE_MESSAGE` | Headless: revoked, used and malformed codes all return that message |
| Linking | 5 failures in 15 minutes lock the account for 15 minutes from the fifth failure (429, with retry time) | `assertNotLocked` | Headless: sixth attempt returns 429 with a Kigali retry time; locked attempts are not logged |
| Linking | Both dashboards show linked status and the other member's name | `family-card.tsx` | Headless: both status views name the partner; dashboard HTML contains "Linked with Teen A" |
| Streak | Only members of a linked family can press "We talked"; others 403; server sets the time | `recordConversation` | Headless: unlinked teen gets 403; `completedAt` defaults to the database clock |
| Streak | Weeks Monday 00:00 to Sunday 23:59 Kigali; a week counts once; streak rules incl. reset | `src/lib/streak.ts` | Unit tests: SRS example (3, then 0, then 1), Sunday/Monday boundary, duplicates, empty, last week carrying |
| Streak | Pure `calculateStreak(dates, now)` with Vitest tests and `npm test` | `src/lib/streak.ts`, `streak.test.ts`, `package.json` | 7 tests pass |
| Streak | Both members see the same streak; history newest first with Kigali date, who, starter | `/api/conversations`, Connect page | Headless: both see streak 1 and the same two records; streak 3 with records in earlier weeks |
| Streak | Connect page with parent view, teen view, streak, history and short explanations | `src/app/connect/page.tsx` | Rendered as linked parent and unlinked teen |
| Content | Seed with 3-4 items per type and about 12 starters linked to topics; review checklist | `prisma/seed.ts`, `docs/content-review.md` | Seed runs idempotently (20 resources, 12 starters) |
| Content | One list component with category filter and empty message; one detail component with "not found" | `resource-list.tsx`, `resource-detail.tsx` | Headless: filter, empty message, unknown section, wrong-role section and unpublished item all checked |
| Content | Six sections wired to the right role and nav | `src/lib/resources.ts`, Understand and Express pages | Headless page renders for each section |
| Check-in | Exactly 8 feelings, optional note up to 500, last 30 newest first, owner only | `src/lib/checkins.ts`, `/api/checkins`, check-in page | Headless: 400 for unknown feeling and 501-character note; 201 for all eight; 30 returned newest first; parent 403; other teen sees none |
| Errors | Unexpected errors return "Something went wrong. Please try again." with 500 and no stack trace; no journal text, notes or codes logged | `apiHandler` | Code review: only error name and message are logged; validation happens before any database write |
| Design | Warm Earth colours, fonts, shapes, bottom nav, line icons, healthcare notice | `globals.css`, `layout.tsx`, components | Visual check of screenshots at 390px (Sprint 5 notes) |
| Quality | Works at 390px wide | all pages | Puppeteer overflow check at 390px (Sprint 5 notes) |
| Quality | Lighthouse on dashboards and journal list | – | Numbers recorded in `docs/notes/sprint-5.md` |

## 2. Not finished or deferred, and why

- **Hosted database migration and seed on TiDB.** The connection string is only on the owner's machine and in Vercel. Until the owner runs `prisma migrate deploy` and `prisma db seed` against TiDB, the live site can sign users in but onboarding and every database page will show "Something went wrong". The exact command is in the README.
- **Browser run-through of onboarding, the journal screens and Clerk's sign-up flow.** Everything server-side was tested headlessly with real sessions, but the Clerk sign-up form and the onboarding form need a browser. Steps are in the chat hand-over and in `docs/usability-test.md`.
- **Lighthouse and 390px checks were run on localhost**, not the live site, because the live database is not yet migrated. The numbers are in `docs/notes/sprint-5.md`.
- **Content accuracy review** is the owner's task (`docs/content-review.md`); the text is draft.
- **Unlinking a family, editing a display name, translations** and other extras are listed in `docs/later.md` and were not in the sprint plan.

## 3. Manual test checklist (Parent A, Teen A, Teen B)

Use three browsers or private windows. Expected results are in brackets.

Privacy

1. Teen A writes a journal entry. Parent A opens every page: Home, Understand, Connect, Profile. [No journal text anywhere.]
2. Parent A opens `/teen/journal` directly. [Redirected to `/parent`.]
3. Parent A calls `GET /api/journal` from the browser address bar. [403 JSON.]
4. Teen B opens Teen A's entry URL (`/teen/journal/<id>`). [Not found.]
5. Teen A records a check-in with a note. Parent A and Teen B open `/teen/express/checkin`. [Parent redirected; Teen B sees only their own list.]
6. Teen A deletes the entry: tap Delete, then "Keep it". [Entry still there.] Tap Delete, then "Yes, delete it". [Gone from the list.]

Linking

7. Teen A opens Connect before linking. [Code form, no "Generate" button.]
8. Parent A generates a code, then generates again. Teen A enters the first code. ["This code is not valid or has expired."]
9. Teen A enters the second code in lowercase with a space. [Linked; both dashboards show the other's name with a green dot.]
10. Teen B enters the same code. [Same error message.]
11. Teen B enters wrong codes six times quickly. [Sixth attempt: "Too many attempts. Please try again after …".]
12. Parent A opens Connect after linking. [No code panel; streak section visible.]

Streak

13. Parent A presses "We talked". [Streak 1; history shows Parent A with the Kigali date and time.]
14. Teen A presses "We talked" choosing a starter. [Streak still 1; history has two rows, newest first, starter text shown.]
15. Both dashboards show the same streak number.

Content

16. Parent A opens Understand, then Parent guides, filters by Puberty. [One guide.] Filters by a category URL that does not exist. ["No resources in this category."]
17. Parent A opens a sensitive conversation. [Linked starters shown below.] Opens a scenario. [Numbered options and "Why this works".]
18. Teen A opens Express, then "How do I bring it up?" and Teen stories. [Lists render.] Teen A edits the URL to `/teen/express/guides`. [Not found.]

## 4. What the owner still needs to do

1. Run the TiDB migration and seed from their own terminal (command in the README under Deploying), then open the live site and complete onboarding once as a parent and once as a teen to confirm the database works online.
2. Review every item in `docs/content-review.md`, fix wording in `prisma/seed.ts`, and re-run the seed locally and on TiDB.
3. Run the usability sessions with `docs/usability-test.md`, using fresh `+clerk_test@example.com` accounts and the code 424242.
4. Move the Sprint 2-5 cards on the project board; all Sprint 1 issues were closed by commits.
5. Optional: run Lighthouse on the live site after the migration and record the numbers next to the localhost ones in `docs/notes/sprint-5.md`.
