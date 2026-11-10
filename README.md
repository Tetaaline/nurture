# NURTURE

NURTURE is a responsive web app that helps parents and teenagers talk to each other with understanding, honesty and care.

## What it helps with

- **Understand**: see what your teen or parent is really feeling.
- **Express**: find the words for hard topics and share them calmly.
- **Connect**: turn better conversations into a stronger bond.

## Tech stack

- [Next.js](https://nextjs.org) with TypeScript
- [Tailwind CSS](https://tailwindcss.com)
- Prisma with MySQL (local development uses XAMPP)
- [Clerk](https://clerk.com) for login (planned for Sprint 2)
- Deployment on Vercel

## Decisions

- **Login provider: Clerk.** The SRS (sections 2.4 and 3.3) says NURTURE uses a managed authentication provider and stores no passwords. NURTURE's own `User` table will store the Clerk user ID, the role (`PARENT` or `TEEN`), the display name and the family link. The role is chosen on an onboarding page after sign-up.
- **Hosted database: Aiven for MySQL (free plan).** It is real MySQL, the same as the local XAMPP database and the SRS, so Prisma and the app code behave the same everywhere. TiDB Cloud Starter is the backup if Aiven causes problems. The Aiven service will be created in Sprint 2, when sign-in needs it. Until then the app uses the local XAMPP database.

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

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Status

Early development. The landing page is in place; the database, login and deployment are still to come.
