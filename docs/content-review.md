# Content review checklist

All content in `prisma/seed.ts` is **draft text written for the prototype**. The owner must review every item below before any real parent or teen sees it. Tick each box only after reading the full text in the seed file.

Review criteria:

- **Accurate**: facts are correct and consistent with current guidance from health and education authorities.
- **Age-appropriate**: suitable for the audience (parents, or teenagers aged roughly 12-18).
- **No identifying details**: teen stories contain no real names, schools, places or details that could identify a person. Every story is a composite and says so.
- **Culturally appropriate**: respectful of Rwandan family life (respect for elders, extended family roles, boarding schools, national exams, faith and community) without stereotyping.

Items to verify specifically:

- [ ] Puberty age ranges in "Talking about puberty before it starts" (8-13 for girls, 9-14 for boys) match the source the owner wants to cite.
- [ ] The statement that Rwandan law protects children from violence at home and at school ("Discipline that teaches instead of shames") is phrased correctly for the current law.
- [ ] "Noticing signs of depression or anxiety" refers to health centres and school counsellors. If the owner wants to add a helpline number, confirm the current number with Rwanda Biomedical Centre first.
- [ ] Sleep target of 8-10 hours for teenagers ("When school pressure gets heavy") matches the chosen source.

## Parent guides (GUIDE, audience PARENT)

| Slug | Title | Accurate | Age-appropriate | No identifying details |
| --- | --- | --- | --- | --- |
| guide-big-feelings | Big feelings are not bad behaviour | [ ] | [ ] | [ ] |
| guide-puberty | Talking about puberty before it starts | [ ] | [ ] | [ ] |
| guide-discipline | Discipline that teaches instead of shames | [ ] | [ ] | [ ] |
| guide-school-pressure | When school pressure gets heavy | [ ] | [ ] | [ ] |

## Sensitive conversations (SENSITIVE_TOPIC, audience PARENT)

| Slug | Title | Accurate | Age-appropriate | No identifying details |
| --- | --- | --- | --- | --- |
| topic-relationships | Talking about relationships and dating | [ ] | [ ] | [ ] |
| topic-substances | Alcohol, drugs and peer pressure | [ ] | [ ] | [ ] |
| topic-mental-health | Noticing signs of depression or anxiety | [ ] | [ ] | [ ] |
| topic-online-safety | Phones, social media and online safety | [ ] | [ ] | [ ] |

## What would you say? (SCENARIO, audience PARENT)

| Slug | Title | Accurate | Age-appropriate | No identifying details |
| --- | --- | --- | --- | --- |
| scenario-door-slam | Your teen slams the door after you ask about homework | [ ] | [ ] | [ ] |
| scenario-lie | You find out your teen lied about where they were | [ ] | [ ] | [ ] |
| scenario-never-listen | Your teen says: "You never listen to me" | [ ] | [ ] | [ ] |
| scenario-grades | Your teen's grades dropped this term | [ ] | [ ] | [ ] |

## How do I bring it up? (OPENER, audience TEEN)

| Slug | Title | Accurate | Age-appropriate | No identifying details |
| --- | --- | --- | --- | --- |
| opener-dont-know-how | How to start when you don't know how | [ ] | [ ] | [ ] |
| opener-school-struggle | Telling your parent you are struggling at school | [ ] | [ ] | [ ] |
| opener-too-strict | When you feel they are too strict | [ ] | [ ] | [ ] |
| opener-mistake | Admitting a mistake before they find out | [ ] | [ ] | [ ] |

## Teen stories (TEEN_STORY, audience BOTH)

| Slug | Title | Accurate | Age-appropriate | No identifying details |
| --- | --- | --- | --- | --- |
| story-thought-mum-angry | I thought my mum would be angry | [ ] | [ ] | [ ] |
| story-failed-exam | The exam I failed | [ ] | [ ] | [ ] |
| story-dinner-silence | Why I stopped talking at dinner | [ ] | [ ] | [ ] |
| story-money-worries | Asking my dad about money worries | [ ] | [ ] | [ ] |

## Conversation starters

| Key | Text | Linked topic | Accurate | Age-appropriate | No identifying details |
| --- | --- | --- | --- | --- | --- |
| day-best-hardest | What was the best part of your day, and what was the hardest? | none | [ ] | [ ] | [ ] |
| your-age-worries | When you were my age, what did you worry about most? | none | [ ] | [ ] | [ ] |
| wish-understood | Is there something you wish I understood better about you? | none | [ ] | [ ] | [ ] |
| proud-at-school | What is one thing at school you are proud of this week? | guide-school-pressure | [ ] | [ ] | [ ] |
| change-one-rule | If you could change one rule at home, which would it be and why? | guide-discipline | [ ] | [ ] | [ ] |
| friends-talk-about | What do your friends talk about that we never talk about at home? | topic-relationships | [ ] | [ ] | [ ] |
| calm-down | What helps you calm down when you are upset? | guide-big-feelings | [ ] | [ ] | [ ] |
| social-media-wrong | What do you think adults get wrong about social media? | topic-online-safety | [ ] | [ ] | [ ] |
| who-do-you-go-to | Who do you go to when something is wrong? Can I be one of those people? | topic-mental-health | [ ] | [ ] | [ ] |
| five-years | What would you like to be doing in five years? | none | [ ] | [ ] | [ ] |
| pressured-by-friends | Was there a time this month you felt pressured by friends? | topic-substances | [ ] | [ ] | [ ] |
| growing-up-questions | Is there anything about growing up that you have questions about? | guide-puberty | [ ] | [ ] | [ ] |

## How to change content

Edit `prisma/seed.ts` and run `npx prisma db seed`. The seed upserts by slug or key, so running it again updates existing rows without duplicating them. Unpublishing an item (setting `isPublished` to false in the database) hides it from every list and detail page.
