# Sprint 1 notes: finish setup

## What was built

- The project runs locally (`npm run dev`) and on Vercel at https://nurture-chi-flax.vercel.app.
- Prisma 7 is connected to the local XAMPP MySQL database through the MariaDB driver adapter.
- The login provider (Clerk) and the hosted database (TiDB Cloud Starter) were chosen and recorded in the README.
- The landing page uses the Warm Earth design: terracotta "NURTURE" top bar with "Sign in", a soft terracotta hero card with "Create an account", three pillar cards with line icons, and the healthcare notice.

## How the important parts work

**Theme colours.** `src/app/globals.css` declares every colour once inside Tailwind's `@theme` block. Think of it as a paint shop with eleven labelled tins: every screen picks from those tins (`bg-primary`, `text-muted`, `border-border`) instead of mixing its own. The fonts (Lora for headings, DM Sans for everything else) are loaded once in `src/app/layout.tsx` and exposed as CSS variables, so the same two typefaces appear everywhere.

**Database connection.** `src/lib/prisma.ts` creates one Prisma client for the whole app and keeps it on a global during development, so hot reloads do not open a new connection each time. The connection string from `DATABASE_URL` is turned into explicit driver settings. This matters for TiDB: its Prisma connection string ends in `?sslaccept=strict`, which the Prisma CLI understands but the MariaDB driver silently ignores. Without the fix the app would try to connect without TLS and TiDB would refuse. The pool is also capped at three connections and opens none in advance, because a serverless host like Vercel can start many copies of the app at once and a free hosted database has a small connection limit. The analogy: the connection string is a hand-written address; the driver only reads typed labels, so we retype the address for it before handing it over.

**Why TiDB instead of Aiven.** Aiven for MySQL only offered a 30-day trial. TiDB Cloud Starter is free with no time limit, MySQL-compatible, and in AWS N. Virginia close to Vercel, with a $0 spending limit.

## How it was tested

- `npm run build` and `npm run lint` pass.
- A script using the same URL-to-settings logic connected to the local database and ran `SELECT VERSION()` successfully (MariaDB 10.4, database `nurture`).
- The TiDB path (TLS on) will be exercised the first time the live site touches the database in Sprint 2.

## Questions a facilitator might ask

1. **Why does the app need both a local and a hosted database?** Local XAMPP is fast and free for development; TiDB is reachable from Vercel. Both are MySQL, so the same Prisma schema and code work on both.
2. **Why not keep passwords in your own database?** Clerk handles passwords, email verification and sessions. The SRS requires a managed authentication provider, which removes the riskiest part of the app.
3. **What does `sslaccept=strict` do?** It tells Prisma to require an encrypted connection and to verify the server's certificate. The app reproduces that setting for the MariaDB driver, which uses a different option name.
4. **Why cap the connection pool at three?** Each Vercel function instance would otherwise open ten connections on start-up; a few instances could exhaust a free database's limit.
