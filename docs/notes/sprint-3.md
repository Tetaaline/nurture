# Sprint 3 notes: family linking and streak

## What was built

- **Invitation codes.** A parent whose family has no teen yet can generate an 8-character code on the Connect page. It is shown once with its expiry time, lasts 24 hours, can be revoked, and generating a new one cancels the old one.
- **Redeeming.** A teen who is not in a family types the code on their Connect page. Any failure shows the same message, "This code is not valid or has expired." After five failed tries within 15 minutes the account is blocked for 15 minutes from the fifth failure and told when to try again.
- **Linked status.** Both dashboards and the Connect page show a green dot with the other member's display name once linked.
- **Weekly streak.** Either member of a linked family can press "We talked" (optionally choosing a conversation starter). The server records the time. Weeks run Monday to Sunday in Kigali time. The streak and a newest-first history (Kigali date, who recorded it, which starter) are shown to both members, and the streak appears on both dashboards.
- Short in-app explanations of how the code and the streak work.

## How the important parts work

**Codes are stored as fingerprints (`src/lib/invite.ts`).** The code is made with `crypto.randomInt` from the letters A-Z and digits 2-9 without I and O, so it is hard to misread. The database never holds the code itself, only an HMAC-SHA-256 hash keyed with `INVITE_CODE_SECRET`. Think of a cloakroom that keeps a photo of your ticket's barcode, not the ticket: a leaked database gives nobody a usable code, and the secret key means an attacker cannot even compute the fingerprint of a guessed code.

**One active code per family.** Generating a code runs two statements in one transaction: revoke every ACTIVE code of the family, then insert the new one. Either both happen or neither.

**Redeeming is one transaction with conditional updates.** The server trims and upper-cases the input, checks the format, hashes it, and looks for an ACTIVE, unexpired code. It then runs `UPDATE ... WHERE status = 'ACTIVE'` on the code and `UPDATE ... WHERE teenId IS NULL` on the family and checks that each changed exactly one row. If two teens submit the same code at the same moment, the database row lock lets only one update succeed; the other sees zero rows, rolls back, and gets the generic failure. The unique index on `Family.teenId` also prevents a teen from being in two families.

**The lockout.** Every attempt is written to `RedemptionAttempt`. Before checking a code, the server counts failures in the last 15 minutes. If there are five, it computes the fifth failure's time plus 15 minutes; if that is still in the future the request is rejected with 429 and the time to retry. Rejected attempts during the lockout are not logged, so the lockout cannot be extended by hammering.

**Streak (`src/lib/streak.ts`).** `calculateStreak(dates, now)` has no database inside, which is what makes it testable. Each timestamp is converted to its Kigali calendar day, moved back to that week's Monday, and turned into a whole number that increases by exactly one per week. The function puts all those week numbers in a set, starts at this week if it is in the set (otherwise last week), and walks backwards while each week is present. The analogy is a wall calendar with a sticker on every week you talked: the streak is how many stickers in a row you can count backwards from today, with this week allowed to be empty because it is not over yet.

**Why `connection()` appears in the auth helpers.** With Cache Components, Next.js does a trial prerender of each page at request time. The MariaDB driver reads the clock while picking a pool connection, and Next.js flagged that as "unstable value during prerender". Calling `connection()` first tells Next.js that everything after it belongs to the request, which is true: it all depends on who is signed in.

## How it was tested

- `npm test`: 7 Vitest tests for the streak, including the SRS example (weeks 40, 41, 42 then Wednesday of week 43 gives 3, Monday of week 44 gives 0, one conversation in week 44 gives 1), the Sunday 23:59 / Monday 00:00 Kigali boundary, several conversations in a week counting once, and empty input.
- `npm run build` and `npm run lint` pass.
- A headless script with real Clerk sessions ran 29 checks against the production build: 401/403 for generating as a visitor or a teen; a valid 8-character code expiring in 24 hours; only the 64-character hash stored; a second code revoking the first (the first then fails to redeem); a code redeemed with lowercase letters, spaces and a dash; the same code failing for a second teen; 409 when a linked teen redeems again or a linked parent generates; both status views naming the other member; 429 with a retry time after five failures and no extra rows logged while locked; 403 on "We talked" and history for an unlinked teen; streak 1 after the first conversation, still 1 after a second in the same week, 400 for an unknown starter, both members seeing the same history and streak, and streak 3 once records exist in the two previous weeks.
- The Connect page was rendered as the linked parent (shows the teen's name, no revoke button) and as an unlinked teen (code form, no generate button).

## Decisions made along the way

- A linked teen trying to redeem again gets 409 with a clear message rather than the generic code failure, because it is not a code problem and the form is not shown anyway.
- Expired codes are marked EXPIRED lazily whenever the parent's status is read, so the status enum stays truthful without a scheduled job.
- The starter picker on "We talked" lists whatever `ConversationStarter` rows exist; the seed content arrives in Sprint 4.

## Questions a facilitator might ask

1. **Why hash the code if it only lives 24 hours?** The database may be backed up or leaked; a hash with a server-side key means a copy of the table is useless.
2. **What stops two teens from redeeming the same code at once?** The conditional updates inside one transaction: only one can change the row from ACTIVE to REDEEMED.
3. **Why is the streak computed from timestamps every time instead of stored as a number?** It is cheap, it can never drift out of sync with the records, and the pure function is easy to test.
4. **Why Monday 00:00 Kigali and not UTC?** Users live in Kigali; a Sunday-night conversation should count for the week it happened in, not for Monday because of UTC.
5. **Why do failed attempts show the same message?** Telling an attacker "right format but expired" or "no such code" would help them narrow the search.
