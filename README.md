# NURTURE

NURTURE is a responsive web app that helps parents and teenagers talk to each other openly.

Live site: https://nurture-chi-flax.vercel.app

## What it helps with

- **Understand**: practical guidance for parents on emotions, puberty, discipline and more.
- **Express**: tools for teens to name their feelings and find the words to share them.
- **Connect**: conversation starters and a weekly streak for the whole family.

NURTURE is an educational tool. It is not a replacement for professional healthcare.

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router) with TypeScript
- [Tailwind CSS 4](https://tailwindcss.com)
- [Prisma 7](https://www.prisma.io) with MySQL (local development uses XAMPP)
- [Clerk](https://clerk.com) for login
- [TiDB Cloud Starter](https://www.pingcap.com/tidb-cloud-starter/) as the hosted database
- [Vercel](https://vercel.com) for hosting

## Decisions

- **Login provider: Clerk.** The SRS (sections 2.4 and 3.3) says NURTURE uses a managed authentication provider and stores no passwords. NURTURE's own `User` table stores the Clerk user ID, the role (`PARENT` or `TEEN`), the display name and the family link. The role is chosen on an onboarding page after sign-up.
- **Hosted database: TiDB Cloud Starter.** Free with no time limit and MySQL-compatible, so Prisma and my code work the same as with my local XAMPP database. Aiven for MySQL was the first choice, but it only offered a 30-day trial, so it was dropped. The instance runs in AWS N. Virginia (us-east-1), close to Vercel's servers, with a $0 spending limit.
- **TLS to TiDB.** TiDB's Prisma connection string ends in `?sslaccept=strict`. The MariaDB driver that Prisma 7 uses in the app does not know that option, so `src/lib/prisma.ts` reads the URL and turns it into explicit driver settings with TLS turned on and a small connection pool. The Prisma CLI (migrations) understands `sslaccept=strict` directly.

## Getting started

1. Clone the repository and open the folder:

   ```bash
   git clone https://github.com/Tetaaline/nurture.git
   cd nurture
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file with `DATABASE_URL` pointing at your local MySQL database and a random `INVITE_CODE_SECRET`, for example:

   ```
   DATABASE_URL="mysql://root@localhost:3306/nurture"
   INVITE_CODE_SECRET="a-long-random-string"
   ```

   Create `.env.local` with your Clerk keys (`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`), then create the tables:

   ```bash
   npx prisma migrate dev
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Status

Sprint 4 complete: sign up and sign in with Clerk, onboarding, dashboards, the private teen journal, family linking with single-use invitation codes, the weekly conversation streak, parent guides, sensitive conversations, scenarios, teen openers and stories, conversation starters and the feelings check-in. Next: hardening, accessibility and performance checks, and the usability test pack (Sprint 5).

Run the unit tests with `npm test`. Load the draft content with `npx prisma db seed` (review `docs/content-review.md` first).
