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

These steps start from a computer with nothing installed. Run every command in **Git Bash** (installed with Git for Windows) or any macOS/Linux terminal.

### 1. Install the tools

- **Node.js 20.9 or newer** (the LTS version from https://nodejs.org is fine; the project was built on Node 24). npm comes with it. Check with `node -v`.
- **Git** from https://git-scm.com (on Windows this also installs Git Bash).
- **XAMPP** from https://www.apachefriends.org, for the local MySQL (MariaDB) database.

### 2. Get the code

```bash
git clone https://github.com/Tetaaline/nurture.git
cd nurture
npm install
```

### 3. Create the local database

1. Open the XAMPP Control Panel and click **Start** next to **MySQL**.
2. Click **Admin** next to MySQL (or open http://localhost/phpmyadmin after starting Apache too), choose **New**, type `nurture` as the database name and click **Create**. Leave it empty; Prisma creates the tables.

You can also create it from Git Bash with XAMPP's own client (default XAMPP path on Windows):

```bash
/c/xampp/mysql/bin/mysql -u root -e "CREATE DATABASE nurture;"
```

### 4. Create the environment files

Both files go in the project folder (next to `package.json`). They are ignored by Git, so they never get committed.

| File | Variable | Where the value comes from |
| --- | --- | --- |
| `.env` | `DATABASE_URL` | Your local XAMPP database: `mysql://root@localhost:3306/nurture` (XAMPP's `root` user has no password by default; if you set one, use `mysql://root:YOURPASSWORD@localhost:3306/nurture`). |
| `.env` | `INVITE_CODE_SECRET` | Any long random string. It is the key used to hash invitation codes. Generate one with the command below. |
| `.env.local` | `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk dashboard (https://dashboard.clerk.com) → your application → **Configure** → **API keys**. Starts with `pk_test_`. |
| `.env.local` | `CLERK_SECRET_KEY` | Same page in the Clerk dashboard. Starts with `sk_test_`. Keep it secret. |

Generate a secret for `INVITE_CODE_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Then create the two files (paste your own values in place of the placeholders):

```bash
cat > .env <<'END'
DATABASE_URL="mysql://root@localhost:3306/nurture"
INVITE_CODE_SECRET="paste-the-generated-string-here"
END

cat > .env.local <<'END'
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_paste-yours-here
CLERK_SECRET_KEY=sk_test_paste-yours-here
END
```

If you use your own Clerk application rather than the project's, turn on **Email** sign-in with a verification code under **Configure** → **User & authentication**.

### 5. Create the tables and load the content

```bash
npx prisma migrate dev
npx prisma db seed
```

`migrate dev` creates all tables in the `nurture` database and generates the Prisma client. `db seed` loads the draft guides, topics, scenarios, stories and conversation starters. Prisma finds its settings in `prisma.config.ts` automatically.

### 6. Start the app

```bash
npm run dev
```

Open http://localhost:3000.

### 7. Sign up with a test email

Clerk's development mode accepts test emails that need no real inbox:

1. Click **Create an account**.
2. Use an email that ends in `+clerk_test@example.com`, for example `grader.parent+clerk_test@example.com`.
3. Choose any password (at least 8 characters).
4. When asked for the verification code, enter **424242**.
5. On the onboarding page, enter a display name and choose **Parent** or **Teen**.

To try family linking, sign up a second test user with the other role in a private window, generate a code on the parent's Connect page and enter it on the teen's Connect page.

For a production build, run `npm run build` then `npm start`.

## Run the tests

```bash
npm test
```

This runs the Vitest unit tests, including the weekly streak calculation (`src/lib/streak.test.ts`) and the invitation code helpers. The tests need no database.

## Hosted database and deploying

Pushes to `main` deploy to Vercel. Vercel needs `DATABASE_URL` (TiDB), `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY` and `INVITE_CODE_SECRET`.

To migrate and seed the hosted TiDB database from your own machine, set `DATABASE_URL` for the current Git Bash session only, run the commands, then remove it:

```bash
export DATABASE_URL='mysql://USER:PASSWORD@HOST:4000/test?sslaccept=strict'
npx prisma migrate deploy
npx prisma db seed
unset DATABASE_URL
```

- Copy the connection string from TiDB Cloud (cluster `nurture` → **Connect** → Prisma). It must end with `?sslaccept=strict`, otherwise the connection is refused because TiDB requires TLS.
- Use single quotes so Git Bash does not change special characters in the password.
- Use `migrate deploy` (not `migrate dev`) for the hosted database: it only applies existing migrations and never resets data.
- An exported variable takes priority over the value in `.env`, so `unset` it afterwards to go back to your local database.

**Keeping the database awake.** The free TiDB Starter database goes to sleep when nobody uses it, and the first request after that can be slow. An uptime monitor pings https://nurture-chi-flax.vercel.app/api/health every 5 minutes to keep it awake. The endpoint needs no login, runs `SELECT 1` and returns `{"status":"ok"}` (200), or `{"status":"error"}` (503) if the database cannot be reached. It returns no user data.

## Documentation

- `docs/notes/sprint-1.md` to `sprint-5.md`: what each sprint built, how it works and how it was tested.
- `docs/content-review.md`: checklist for reviewing the draft content before real users see it.
- `docs/usability-test.md`: the five tasks, consent form, observation sheet and test account steps.
- `docs/final-report.md`: every SRS requirement built and how it was verified.
- `docs/later.md`: ideas deliberately left for later.

## Status

All five planned sprints are built and the live site is running on the migrated and seeded TiDB database (checked on 22 Nov 2026). Still open: the draft content has not yet been reviewed (`docs/content-review.md`), the usability sessions with adult testers have not been run yet (`docs/usability-test.md`), and Clerk's sign-up form has not been completed end to end by a person on the live site. See `docs/final-report.md` for details.
