# NURTURE usability test pack

This pack supports a small usability study with 5 to 8 participants (P1-P8). As the SRS requires, every participant is a consenting adult (18 or older); no minors take part. Each participant plays either the parent role or the teen role, aiming for a roughly even split between the two, and can be tested alone or in pairs. Each session takes about 30 minutes on the participant's own phone or a phone provided by the facilitator, using the live site at https://nurture-chi-flax.vercel.app.

## The five hypothesis tasks

Each task tests one hypothesis from the SRS. Read the task aloud exactly as written. Do not help unless the participant is stuck for more than two minutes; if you help, record it as an error.

| # | Task (read aloud) | Role | Hypothesis | Success looks like |
| --- | --- | --- | --- | --- |
| 1 | "Create an account and set yourself up as a parent (or teen)." | Both | A new user can create an account and choose a role without help. | Lands on the correct dashboard with their chosen display name shown. |
| 2 | Parent: "Find advice about how to talk to your teen about relationships." Teen: "Record how you are feeling right now, with a short note." | Both | Content and the check-in are easy to find from the dashboard or bottom nav. | Parent opens the "Talking about relationships and dating" topic. Teen saves a check-in and sees it in the list. |
| 3 | Teen: "Write a short journal entry about your day, then change its title." | Teen | The journal is understood as private and the edit flow is clear. | Entry saved, title changed, participant can say who can read it (nobody else). |
| 4 | Teen: "Delete the journal entry you just wrote." | Teen | Deleting is safe and reversible until confirmed. | Entry deleted after the confirm step; participant notices the confirm step. |
| 5 | Parent: "Invite your teen to link accounts." Teen: "Use the code your parent gives you to link." Then either: "Record that you talked today." | Both | Linking by code and the weekly streak are understandable. | Both see "Linked with …" and a streak of 1 after pressing "We talked". |

For Task 5 with a single participant, the facilitator plays the other role on a second device using a test account from the list below.

## Consent form

Confirm the participant is 18 or older, read the form together, then ask them to sign or give recorded verbal consent. Do not run a session with anyone under 18.

> **NURTURE usability study: consent**
>
> I am being asked to try a student prototype called NURTURE, a web app that aims to help parents and teenagers talk more openly. I will play the role of a parent or a teenager using test accounts. The purpose of this session is to test the app, not me. There are no right or wrong answers.
>
> I understand that:
> - I confirm that I am 18 years of age or older.
> - The session lasts about 30 minutes and I can stop at any time without giving a reason.
> - The facilitator will take notes on what I do and say. No audio or video is recorded unless I agree separately below.
> - I will use a test account, not my personal email. Anything I type during the session may be seen by the facilitator and will be deleted after the study.
> - I should not type real private information, such as real journal entries or real health details, during the test.
> - NURTURE is an educational tool and not a replacement for professional healthcare.
> - My name will not appear in any report. Results are reported as P1-P8.
>
> Participant name: ______________________  Role played: Parent / Teen
> Signature or verbal consent recorded: ______________________  Date: ____________
>
> [ ] I agree to audio recording of this session (optional).

## Observation sheet

One sheet per participant. Time each task from the moment you finish reading it to the moment the success condition is met or the participant gives up. An "error" is any wrong tap that moves away from the task, any request for help, or any error message shown by the app.

**Participant:** P__   **Role played:** Parent / Teen   **Device:** ________   **Date:** ________

| Task | Completed (Y/N) | Time (mm:ss) | Errors (count) | Help given (Y/N) | Comments and quotes |
| --- | --- | --- | --- | --- | --- |
| 1. Create account and choose role | | | | | |
| 2. Find content / record check-in | | | | | |
| 3. Write and edit a journal entry | | | | | |
| 4. Delete the entry | | | | | |
| 5. Link accounts and record "We talked" | | | | | |

After the tasks, ask:

1. "Which part was most confusing?"
2. "Who do you think can read a teen's journal?" (Correct answer: only the teen.)
3. "In your own words, how does the weekly streak work?"
4. "Would a real parent or teen find this useful? Why or why not?"
5. "Rate the overall ease of use from 1 (very hard) to 5 (very easy)."

Summary grid (fill in after all sessions):

| | P1 | P2 | P3 | P4 | P5 | P6 | P7 | P8 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Role played | | | | | | | | |
| Tasks completed (of 5) | | | | | | | | |
| Total errors | | | | | | | | |
| Ease rating (1-5) | | | | | | | | |

## Creating fresh test accounts

NURTURE uses Clerk's development instance, which accepts special test emails that need no real inbox.

1. Open https://nurture-chi-flax.vercel.app and tap **Create an account**.
2. Use an email of the form `nurture.p1+clerk_test@example.com` (change `p1` for each participant; the suffix `+clerk_test@example.com` must stay exactly as written).
3. Choose any password of at least 8 characters and write it on the observation sheet.
4. When asked for the email verification code, enter **424242**.
5. Complete onboarding with a display name and the role for that participant.

Ready-made accounts (already onboarded, so they skip Task 1). Choose any password of 8+ characters when signing up.

| Role | Email | Notes |
| --- | --- | --- |
| Parent | nurture.parent.a+clerk_test@example.com | Linked with Teen A during development; unlink by having the owner reset the family in the database, or use fresh accounts. |
| Teen | nurture.teen.a+clerk_test@example.com | |
| Teen | nurture.teen.b+clerk_test@example.com | Not linked; useful for testing a wrong code. |

For Task 5 use a fresh parent and a fresh teen so the linking flow starts from "Not linked yet".

After the study, delete the participants' test users in the Clerk dashboard (Users, filter by `clerk_test`) and run the clean-up query the owner keeps for the database, or leave them: the accounts hold no real data.
