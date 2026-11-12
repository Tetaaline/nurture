# Sprint 4 notes: content and check-in

## What was built

- **Seed content** in `prisma/seed.ts`: 4 parent guides, 4 sensitive conversations, 4 "What would you say?" scenarios, 4 "How do I bring it up?" openers for teens, 4 teen stories and 12 conversation starters, 8 of them linked to a guide or topic. Everything is draft text and is listed for review in `docs/content-review.md`.
- **One list and one detail component** (`src/components/resource-list.tsx`, `resource-detail.tsx`) reused by six sections: Parent guides, Sensitive conversations (with linked starters), What would you say?, Teen stories (both roles), How do I bring it up? (teens) and Conversation starters (both roles).
- **Feelings check-in** for teens: exactly the eight feelings with their dot colours, an optional note up to 500 characters, and the last 30 check-ins newest first. Same owner-only rules as the journal.
- Every section is reachable from the right dashboard and bottom nav: Understand for parents, Express for teens.

## How the important parts work

**Sections, not pages (`src/lib/resources.ts`).** A section is a small description: which resource type it shows, which audiences, its title and its base path. The parent route `/parent/understand/[section]` and the teen route `/teen/express/[section]` look the section up by its key; unknown keys, or keys that belong to the other role, give a "not found" page. The analogy is a library with one reading room and many shelf labels: the room is the same component, the label decides which shelf is pulled out. A teen opening `/teen/express/guides` finds no such label and gets nothing.

**Published only.** Every query includes `isPublished: true`. Setting a row to unpublished hides it from lists and makes its detail page "not found" immediately. This is how the owner can pull an item while reviewing content.

**Category filter.** The list page reads `?category=` from the URL, shows the available categories as chips, and shows "No resources in this category" when the filter matches nothing.

**Scenarios are structured text.** The body of a scenario holds the situation, two to four `Response:` paragraphs and one `Why:` paragraph. The body renderer turns those into numbered option cards and a "Why this works" box, without any extra database columns.

**Check-in validation (`src/lib/checkins.ts`).** A Zod schema allows only the eight feeling values and a note of at most 500 characters after trimming; a blank note is stored as nothing. A longer note is rejected with a field message and nothing is saved.

**Seeding is repeatable.** Resources have a unique `slug` and starters a unique `key`, so `npx prisma db seed` updates existing rows instead of duplicating them. Two columns were added for this in a second migration.

## How it was tested

- `npm run build`, `npm run lint` and `npm test` pass.
- A headless script with real Clerk sessions ran 33 checks against the production build: 401 and 403 on the check-in API for visitors and parents; 400 with field messages for an unknown feeling and a 501-character note with nothing saved; 201 for all eight feelings; trimmed notes and blank notes stored as null; the last 30 returned newest first with `no-store`; another teen seeing none of them; the guides list, the category filter and the empty-category message; linked starters on a sensitive topic; option and "why" boxes on a scenario; openers and stories rendering for the right roles; the starters page linking its topics; the check-in page showing the form and history; a parent on the check-in page being redirected without seeing a note; and "not found" for an opener requested under the guides section, for a teen opening the parent guides section, and for an unpublished story.
- Because pages stream, "not found" and redirects arrive inside a 200 response with the not-found view in the body; the checks look at the rendered content rather than the status code.

## Decisions made along the way

- Scenario responses live in the body text with a simple `Response:` / `Why:` convention instead of a new table, which keeps the schema as the SRS describes it.
- Teen stories include a closing line saying they are composites written for NURTURE, so no reader mistakes them for a real person's account.
- Health advice points to health centres and school counsellors rather than quoting a helpline number; the owner should add a verified number during content review.

## Questions a facilitator might ask

1. **Where does the content come from?** It is draft text written for the prototype, based on widely published parenting and adolescent health guidance, and it is flagged for the owner's review before real use.
2. **How do you stop a teen from reading parent-only guidance?** The teen routes only know the teen sections; the guide section does not exist under `/teen/express`, and the query itself filters by audience.
3. **Why reuse one component for six sections?** Less code to test, one place to fix bugs, and consistent behaviour such as the empty-category message everywhere.
4. **Can a parent see a teen's check-ins?** No. The check-in API requires the teen role and always filters by the signed-in owner, and no parent page queries check-ins.
