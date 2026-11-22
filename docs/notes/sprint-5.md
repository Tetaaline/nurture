# Sprint 5 notes: harden and freeze

## What was done

- Privacy note on the journal list and in the editor: "Only you can see this, not even your parent."
- Every page checked at 390px wide with a headless Chrome script (real sessions, screenshots saved). Two fixes came out of it: long unbroken words in a journal entry pushed the page to 788px wide, fixed with `overflow-wrap: anywhere` on headings, paragraphs and list items; and the "Read: …" topic links on the starters page and the NURTURE logo link were under 44px tall, fixed with a minimum height.
- Lighthouse run on both dashboards and the journal list (numbers below).
- README rewritten with a short user guide, the live link, how to run locally, how to run the tests and how to migrate the hosted database.
- `docs/usability-test.md`: the five hypothesis tasks, consent form, observation sheet (P1-P8) and steps for fresh test accounts.
- `docs/final-report.md`: every requirement with its verification, what is deferred, the three-account manual checklist and the owner's remaining tasks.
- Final check of the live site: landing, sign-in, sign-up and onboarding pages respond, and the journal API returns 401 without a session. After the owner migrated and seeded TiDB, the full live check below was run on 22 Nov 2026.

## Lighthouse (localhost production build, mobile preset, signed in)

Run on the local production build (`next start`) because the hosted database was not migrated yet. The browser was given a real session token through an extra request header.

| Page | Performance | Accessibility | Best practices | SEO | FCP | LCP | TBT | CLS |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/parent` | 98 | 100 | 96 | 100 | 0.8 s | 0.8 s | 160 ms | 0 |
| `/teen` | 98 | 100 | 96 | 100 | 0.8 s | 0.8 s | 150 ms | 0 |
| `/teen/journal` | 99 | 100 | 96 | 100 | 0.8 s | 0.8 s | 110 ms | 0 |

Honest notes on these numbers:

- The only failing audit in Best practices is "errors in console". The errors are CORS failures loading Clerk's browser script, caused by the test harness attaching the session header to every request, including Clerk's CDN. A normal browser session does not send that header, so this is an artefact of how the test was run, not of the app. It could not be excluded without dropping the signed-in state.
- Localhost has no network latency, so these are best-case numbers. The live numbers are in the next section.
- An earlier run with expired tokens measured the sign-in redirect page instead (performance 61-72). Those numbers were discarded because they did not measure the intended pages.

## Lighthouse (live site, mobile preset, signed in, 22 Nov 2026)

Same method as above, run once per page against https://nurture-chi-flax.vercel.app after the TiDB migration.

| Page | Performance | Accessibility | Best practices | SEO | FCP | LCP | TBT | CLS |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/parent` | 73 | 100 | 96 | 100 | 1.2 s | 3.5 s | 730 ms | 0 |
| `/teen` | 78 | 100 | 96 | 100 | 0.9 s | 1.0 s | 990 ms | 0 |
| `/teen/journal` | 79 | 100 | 96 | 100 | 2.0 s | 2.8 s | 580 ms | 0 |

- Performance is 20-25 points lower than on localhost. Most of it is Total Blocking Time: Lighthouse slows the CPU four times to imitate a mid-range phone, and the Clerk and React scripts take longer to run on the throttled CPU over a real network. LCP also includes the trip from Vercel to the database in us-east-1 and any cold start of the server function.
- The `/parent` LCP of 3.5 s is over the 2.5 s "good" mark; the other two pages are within it. Each page was measured once, so expect a few points of variation between runs.
- Best practices fails only "errors in console", for the same header artefact explained above.

## Live check (22 Nov 2026)

Three test accounts (Parent A, Teen A, Teen B) were onboarded through the real onboarding form in headless Chrome at 390px, then used against the live APIs and pages:

- Onboarding created each user and sent them to the right dashboard; both dashboards show the healthcare notice.
- Linking: a wrong code and a reused code both gave "This code is not valid or has expired."; a teen cannot generate a code (403); the parent's code worked when typed in lowercase with spaces; a second code after linking was refused (409); both sides show the other's name.
- Streak: "We talked" before linking was refused (403) and Teen B (unlinked) was refused; after both members recorded a conversation the streak was 1 on both sides with two history rows, newest first.
- Privacy: Parent A gets 403 for the journal and check-ins; Teen B gets 404 for Teen A's entry (read and delete) and an empty list of their own; journal responses carry `Cache-Control: no-store`; invalid journal and check-in input returns field messages and saves nothing.
- Content: every Understand and Express section lists its seeded items (4 each) and the starters page is filled, so the seed reached TiDB. No page scrolled sideways at 390px.
- Opening the other role's dashboard redirected to your own.

## 390px check

Nineteen pages were loaded at 390x844 as a visitor, as the parent and as the teen. After the two fixes above, every page reports a scroll width of 390px with no element wider than the viewport, and no link or button under 40px tall except inside Clerk's own sign-in widget (its "Sign up" link and icon buttons), which NURTURE does not control.

## How it was tested

- `npm run build`, `npm run lint` and `npm test` pass after the changes.
- The 390px script and Lighthouse were rerun after the fixes; results are the ones above.
- Screenshots of all nineteen pages were reviewed for the Warm Earth design: sand background, white cards with 14px corners, terracotta primary buttons, Lora headings and DM Sans text, bottom nav with four items and the active item in terracotta.

## Questions a facilitator might ask

1. **Why are there two sets of Lighthouse numbers?** The first run was on localhost before the hosted database was migrated. The live run came later; it is slower because of real network, the database trip and a throttled CPU, and both are recorded so the difference is visible.
2. **What did the 390px check actually find?** A long word without spaces could widen a journal page, and some links were too small to tap comfortably. Both were fixed.
3. **Where is the privacy note enforced?** The note is text; the enforcement is in the API and page code, which only ever query by the signed-in owner.
4. **How will the usability tests avoid real data?** Participants use test emails that need no inbox, the consent form asks them not to type real private information, and the accounts can be deleted afterwards.
