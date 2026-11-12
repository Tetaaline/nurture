# Sprint 2 notes: accounts and journal

## What was built

- **Sign up and sign in** through Clerk (email only), styled with the Warm Earth colours and fonts. Clerk runs on its development instance; the keys live in `.env.local` locally and in Vercel's settings online.
- **Onboarding** at `/onboarding`: a new user chooses a display name and a role (Parent or Teen). This creates the `User` row, and a parent also gets an empty `Family` row.
- **Dashboards** at `/parent` and `/teen`, each with the bottom nav (Home, Understand or Express, Connect, Profile) and the healthcare notice. Opening the other role's dashboard redirects to your own. A profile page shows your details and a sign-out button.
- **Teen journal**: list, new entry, view, edit and delete (with a confirm step), backed by a JSON API at `/api/journal` and `/api/journal/[id]`.
- **Database schema** for the whole project (users, families, invitation codes, journal, check-ins, resources, starters, conversation records), migrated locally.

## How the important parts work

**Who are you? (`src/lib/auth.ts`).** Clerk only tells us "this browser belongs to Clerk user X". NURTURE keeps its own `User` table that maps that Clerk ID to a display name and a role. Every protected page or API route starts by asking this file. Think of a building with a receptionist (Clerk) who checks your ID at the door, and a floor manager (our `User` table) who knows which floor you work on. `requireRole("TEEN")` is the floor manager for API routes: no ID gives 401, wrong floor gives 403. `requirePageRole` does the same for pages but redirects instead of returning numbers.

**Owner-only data.** Every journal query includes `ownerId` from the session, never from the request. Another teen asking for your entry gets 404 ("there is no such entry for you"), not 403, so the response does not even confirm the entry exists. Parents get 403 on every journal route, and no parent page ever loads journal data.

**Validation (`src/lib/journal.ts`).** A Zod schema is the bouncer at the door of the database: title up to 100 characters, body between 1 and 5000 after trimming. If anything is wrong the request stops with a 400 and a message per field, and nothing is written.

**Errors.** `apiHandler` in `src/lib/http.ts` wraps every API function. Known errors become their status code; anything unexpected is logged by name only (never the text of an entry) and the client sees "Something went wrong. Please try again." with status 500. Every journal response also carries `Cache-Control: no-store`, so no browser or proxy keeps a copy.

**Cache Components.** Next.js 16 pre-renders the static shell of each page (header, nav, headings) and streams the parts that depend on the signed-in user inside `<Suspense>` boundaries. That is why every page has a small async component for the personal part.

**TiDB over TLS.** The connection string from TiDB ends in `?sslaccept=strict`. The Prisma CLI understands it; the MariaDB driver the app uses does not, so `src/lib/prisma.ts` converts the URL into explicit settings with TLS on and a pool of at most three connections.

## How it was tested

- `npm run build`, `npm run lint` and `npx clerk doctor` pass.
- A headless script created three Clerk test users (Parent A, Teen A, Teen B), minted real session tokens through Clerk's backend API, and ran 25 checks against the production build on localhost: 401 without a session, 403 for the parent on every journal route, 404 for the other teen on read/edit/delete, 400 with field messages for empty body, 101-character title, 5001-character body, blank body, malformed JSON and an empty update, 201 for a valid entry with a trimmed title, newest-first ordering, `no-store` on responses, and 404 after delete. Nothing was saved after the invalid requests.
- Pages were checked without a session (streamed 307 to `/sign-in`) and the dashboards were rendered as the parent to confirm no journal text appears.
- Onboarding and the journal screens still need a browser run-through by the owner (steps in the chat summary).

## Decisions made along the way

- Sign-in and sign-up both land on `/onboarding`, which forwards existing users to their dashboard. This keeps one rule in code instead of relying on Clerk redirect environment variables, which are not set on Vercel.
- Understand, Express and Connect have placeholder pages so the bottom nav never leads to a 404; they are filled in Sprints 3 and 4.
- `tsx` was added as a dev dependency to run TypeScript scripts (the seed in Sprint 4 and local test scripts).

## Questions a facilitator might ask

1. **Why return 404 instead of 403 when a teen opens someone else's entry?** 403 would confirm that the entry exists. 404 gives away nothing.
2. **Where is the role stored and why not in Clerk?** In NURTURE's own `User` table, next to the family link, so the app owns its rules and can query them with the rest of the data.
3. **What stops a parent from calling the journal API directly?** `requireRole("TEEN")` runs on the server for every journal route and returns 403 before any query. Hiding links in the parent interface is only a courtesy.
4. **Why does a page sometimes return HTTP 200 and still send me to sign in?** The static shell is served first, then the server streams a redirect instruction for the personal part. The browser follows it the same way.
5. **What happens if the user submits onboarding twice quickly?** The second insert hits the unique Clerk ID constraint; the action catches that and just sends the user to the dashboard that the first submission created.
