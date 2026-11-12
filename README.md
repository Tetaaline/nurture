# NURTURE

NURTURE is a responsive web app that helps parents and teenagers talk to each other openly.

Live site: https://nurture-chi-flax.vercel.app

## What it helps with

- **Understand**: practical guidance for parents on emotions, puberty, discipline and more.
- **Express**: tools for teens to name their feelings and find the words to share them.
- **Connect**: conversation starters and a weekly streak for the whole family.

NURTURE is an educational tool. It is not a replacement for professional healthcare.

## User guide

**Getting started.** Open the live site, tap **Create an account**, sign up with your email, then choose a display name and whether you are a **Parent** or a **Teen**. You land on your own dashboard with a bottom navigation bar.

**Parents** (Home, Understand, Connect, Profile)

- *Understand* holds parent guides, sensitive conversations (each with conversation starters you can use), "What would you say?" scenarios with example responses, teen stories and the full list of conversation starters. Filter any list by category.
- *Connect* is where you link with your teen. Tap **Generate code**, read the 8-character code to your teen, and they enter it on their Connect page. The code lasts 24 hours, works once, and you can revoke it. Once linked, both of you can press **We talked** after a real conversation. Each week (Monday to Sunday, Kigali time) with at least one conversation adds to your shared streak.
- *Profile* shows your details and lets you sign out.

**Teens** (Home, Express, Connect, Profile)

- *My journal* (from Home or Express) is private. Only you can see it, not even your parent. Write, edit and delete entries; deleting asks you to confirm.
- *Feelings check-in* lets you pick one of eight feelings and add an optional note. Your last 30 check-ins are listed. These are private too.
- *Express* also has "How do I bring it up?" with ways to start a hard conversation, teen stories and conversation starters.
- *Connect* is where you enter your parent's code and, once linked, record that you talked and watch the streak.

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router, Cache Components) with TypeScript
- [Tailwind CSS 4](https://tailwindcss.com)
- [Prisma 7](https://www.prisma.io) with MySQL (local development uses XAMPP)
- [Clerk](https://clerk.com) for login
- [TiDB Cloud Starter](https://www.pingcap.com/tidb-cloud-starter/) as the hosted database
- [Vercel](https://vercel.com) for hosting
- [Vitest](https://vitest.dev) for unit tests

## Decisions

- **Login provider: Clerk.** The SRS (sections 2.4 and 3.3) says NURTURE uses a managed authentication provider and stores no passwords. NURTURE's own `User` table stores the Clerk user ID, the role (`PARENT` or `TEEN`), the display name and the family link. The role is chosen on an onboarding page after sign-up.
- **Hosted database: TiDB Cloud Starter.** Free with no time limit and MySQL-compatible, so Prisma and my code work the same as with my local XAMPP database. Aiven for MySQL was the first choice, but it only offered a 30-day trial, so it was dropped. The instance runs in AWS N. Virginia (us-east-1), close to Vercel's servers, with a $0 spending limit.
- **TLS to TiDB.** TiDB's Prisma connection string ends in `?sslaccept=strict`. The MariaDB driver that Prisma 7 uses in the app does not know that option, so `src/lib/prisma.ts` reads the URL and turns it into explicit driver settings with TLS turned on and a small connection pool. The Prisma CLI (migrations) understands `sslaccept=strict` directly.
- **Privacy is enforced on the server.** Journal entries and check-ins are always queried with the owner's ID from the session. Parents get 403 on those APIs; another teen gets 404. Invitation codes are stored only as keyed hashes.

## Run it locally

1. Clone the repository and install dependencies:

   ```bash
   git clone https://github.com/Tetaaline/nurture.git
   cd nurture
   npm install
   ```

2. Start MySQL (XAMPP) and create an empty database called `nurture`.

3. Create a `.env` file with your local database URL and a random secret for invitation codes:

   ```
   DATABASE_URL="mysql://root@localhost:3306/nurture"
   INVITE_CODE_SECRET="a-long-random-string"
   ```

4. Create `.env.local` with your Clerk keys from the Clerk dashboard:

   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   ```

5. Create the tables and load the draft content:

   ```bash
   npx prisma migrate dev
   npx prisma db seed
   ```

6. Start the development server and open http://localhost:3000:

   ```bash
   npm run dev
   ```

For a production build, run `npm run build` then `npm start`.

## Run the tests

```bash
npm test
```

This runs the Vitest unit tests, including the weekly streak calculation (`src/lib/streak.test.ts`).

## Deploying

Pushes to `main` deploy to Vercel. Vercel needs `DATABASE_URL` (TiDB), `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY` and `INVITE_CODE_SECRET`. To migrate and seed the hosted database from your own machine, set `DATABASE_URL` to the TiDB connection string for that one command:

```powershell
$env:DATABASE_URL="<TiDB connection string>"; npx prisma migrate deploy; npx prisma db seed; Remove-Item Env:DATABASE_URL
```

## Documentation

- `docs/notes/sprint-1.md` to `sprint-5.md`: what each sprint built, how it works and how it was tested.
- `docs/content-review.md`: checklist for reviewing the draft content before real users see it.
- `docs/usability-test.md`: the five tasks, consent form, observation sheet and test account steps.
- `docs/final-report.md`: every SRS requirement built and how it was verified.
- `docs/later.md`: ideas deliberately left for later.

## Status

All five sprints complete. Before real users: review the content (`docs/content-review.md`), migrate and seed the hosted database, and run the usability sessions (`docs/usability-test.md`).
