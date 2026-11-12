import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../generated/prisma/client";
import type { Audience, ResourceType } from "../generated/prisma/enums";

type ResourceSeed = {
  slug: string;
  type: ResourceType;
  audience: Audience;
  category: string;
  title: string;
  body: string;
};

type StarterSeed = {
  key: string;
  text: string;
  category: string;
  resourceSlug?: string;
};

const p = (...paragraphs: string[]) => paragraphs.join("\n\n");

export const resources: ResourceSeed[] = [
  {
    slug: "guide-big-feelings",
    type: "GUIDE",
    audience: "PARENT",
    category: "Emotions",
    title: "Big feelings are not bad behaviour",
    body: p(
      "Teenagers feel things strongly. The part of the brain that handles planning and self-control is still developing until the mid-twenties, while the part that reacts to emotion is already fully active. A slammed door or sudden tears is often a feeling that arrived faster than the words for it.",
      "What helps:",
      "- Name what you see, calmly: \"You seem really upset.\" Naming a feeling lowers its intensity.",
      "- Wait before correcting. A teen who is flooded with emotion cannot take in a lesson. Return to the behaviour later, when both of you are calm.",
      "- Separate the feeling from the action. Anger is allowed; shouting at a younger sibling is not.",
      "- Keep your own voice low. Teens match the volume in the room.",
      "What to avoid: laughing at the feeling, comparing them with a sibling or cousin, or bringing up old mistakes. These teach a teen to hide what they feel rather than to manage it.",
      "If strong moods last for weeks, affect sleep or eating, or come with talk of hopelessness, speak to a health worker. This app is not a replacement for that.",
    ),
  },
  {
    slug: "guide-puberty",
    type: "GUIDE",
    audience: "PARENT",
    category: "Puberty",
    title: "Talking about puberty before it starts",
    body: p(
      "Puberty usually begins between 8 and 13 for girls and 9 and 14 for boys, and it can be earlier or later and still be normal. Children who hear about the changes from a parent first feel less afraid and are less likely to rely on rumours from friends.",
      "Small conversations work better than one big talk. Use everyday moments: a younger cousin growing taller, an advert, a question from a sibling.",
      "- Girls: breast changes, hair growth, periods and how to manage them at school, and that mood changes are common.",
      "- Boys: voice changes, hair growth, growth spurts and wet dreams, and that these are normal and nothing to be ashamed of.",
      "- Both: body odour and washing, acne, feelings of attraction, and that everyone develops at their own pace.",
      "In many families these topics were never discussed openly. It is fine to say, \"Nobody talked to me about this, so I am learning how to talk about it with you.\" If it feels too hard, an aunt, uncle or trusted adult the teen respects can help, as long as the information is accurate.",
      "Keep supplies at home for periods and make sure your daughter knows where they are. Missing school because of a period is common and avoidable.",
    ),
  },
  {
    slug: "guide-discipline",
    type: "GUIDE",
    audience: "PARENT",
    category: "Discipline",
    title: "Discipline that teaches instead of shames",
    body: p(
      "The word discipline comes from \"to teach\". Teens learn most from consequences that are clear, fair and connected to what they did, and least from humiliation, which produces fear and secrecy rather than better choices.",
      "A simple structure:",
      "- Agree the rules in advance, with the reason behind each one. Teens follow rules they understand far more often.",
      "- Make consequences related and short. Came home late? An earlier time next weekend, not a month without friends.",
      "- Follow through calmly every time. Consistency matters more than severity.",
      "- Repair afterwards. Once the consequence is done, the matter is closed. Do not keep bringing it up.",
      "Physical punishment and insults are linked in research to more aggression, more lying and worse mental health. Rwanda's law also protects children from violence at home and at school. If you grew up with harsh punishment, choosing differently is not weakness; it is a change you are making for your family.",
      "When you lose your temper, say so: \"I shouted and that was wrong.\" A teen who sees a parent apologise learns how to do it too.",
    ),
  },
  {
    slug: "guide-school-pressure",
    type: "GUIDE",
    audience: "PARENT",
    category: "School",
    title: "When school pressure gets heavy",
    body: p(
      "National exams, boarding school, a long school day and high family expectations can add up. Pressure helps up to a point; past that point it hurts concentration, sleep and health.",
      "Signs that it has become too much: headaches or stomach aches before school, sleeping much less or much more, giving up on subjects they used to like, saying \"what is the point\", or sudden drops in marks.",
      "What helps:",
      "- Ask about effort and learning, not only about the position in class.",
      "- Protect sleep. A tired brain cannot revise. Eight to ten hours is the target at this age.",
      "- Help them plan: break revision into short blocks with rest, and agree which chores pause during exam weeks.",
      "- Say clearly that your love does not depend on results. Many teens believe it does, even when parents never meant that.",
      "If your teen is at boarding school, use visiting days and phone calls to ask how they are, not only how the marks are. If you suspect a problem with a teacher or other students, contact the school directly.",
    ),
  },

  {
    slug: "topic-relationships",
    type: "SENSITIVE_TOPIC",
    audience: "PARENT",
    category: "Relationships",
    title: "Talking about relationships and dating",
    body: p(
      "Most teens become interested in romantic relationships, whether or not a family allows dating. Silence does not stop the interest; it only means the teen learns from friends, music and the internet.",
      "Aim to be the person they can ask. That means reacting calmly to a first question even if it surprises you.",
      "- Talk about respect: no one should pressure, threaten or shame a partner, and a \"no\" must always be accepted.",
      "- Talk about age gaps and gifts. An older person, or anyone offering money, phones or school fees in exchange for a relationship, is not safe. Make clear your teen can always come to you if this happens, without punishment.",
      "- Share your family's values and the reasons for them, and listen to your teen's view. Rules with reasons are respected more than rules alone.",
      "- Give accurate information about pregnancy and infections. Knowledge delays risky behaviour; it does not encourage it.",
      "If something has already happened that worries you, stay calm first. A teen who is shouted at will not tell you the rest.",
    ),
  },
  {
    slug: "topic-substances",
    type: "SENSITIVE_TOPIC",
    audience: "PARENT",
    category: "Safety",
    title: "Alcohol, drugs and peer pressure",
    body: p(
      "Teens are more likely to try alcohol or drugs when friends do, when adults around them drink heavily, and when they have no clear plan for saying no. Talking about it early, before it comes up, is protective.",
      "- Be clear about your expectation and the reason: developing brains are more easily harmed, and the law is strict.",
      "- Practise refusals together: \"No thanks, I am training tomorrow\", \"My mum checks, it is not worth it\". A ready sentence is easier to use under pressure.",
      "- Agree a safety rule: if they are ever somewhere unsafe, they can call you for help and the conversation about how they got there happens the next day, calmly.",
      "- Notice the signs: smell, red eyes, missing money, new friends they will not introduce, sudden changes in sleep or mood.",
      "If you discover use, choose a calm moment and ask questions before giving consequences. Occasional experimentation and regular use need different responses. For regular use, a health centre or school counsellor can help; you do not have to handle it alone.",
    ),
  },
  {
    slug: "topic-mental-health",
    type: "SENSITIVE_TOPIC",
    audience: "PARENT",
    category: "Mental health",
    title: "Noticing signs of depression or anxiety",
    body: p(
      "Low mood and worry are part of growing up, but depression and anxiety are more than a bad week. They last, they get in the way of school and friendships, and they do not go away with \"just be strong\".",
      "Signs to watch for over two weeks or more: withdrawing from friends and family, losing interest in things they enjoyed, sleeping or eating much more or less, irritability, difficulty concentrating, frequent headaches or stomach aches, talking about being a burden or wishing they were not here.",
      "How to open the conversation:",
      "- Pick a private moment and a side-by-side activity, such as walking or cooking.",
      "- Describe what you have noticed without judgement: \"You have been very quiet lately and I care about you.\"",
      "- Ask directly and calmly whether they have had thoughts of hurting themselves. Asking does not plant the idea; it shows it is safe to tell you.",
      "- Listen more than you advise. Avoid \"other people have it worse\".",
      "If you are worried, go to your nearest health centre or hospital; mental health services exist across Rwanda, and schools often have a counsellor. If your teen talks about ending their life, do not leave them alone and seek help the same day.",
    ),
  },
  {
    slug: "topic-online-safety",
    type: "SENSITIVE_TOPIC",
    audience: "PARENT",
    category: "Online life",
    title: "Phones, social media and online safety",
    body: p(
      "Phones connect teens to friends, information and entertainment, and also to strangers, pressure and content made for adults. Banning phones entirely rarely works; teaching good habits does.",
      "Agree together:",
      "- Phone-free times, such as meals and the hour before sleep, for everyone in the house including adults.",
      "- Privacy settings: accounts set to private, no sharing of location, school or home address.",
      "- The rule that photos sent to anyone can end up anywhere, and that nobody should ever pressure them for private pictures.",
      "- That they can come to you about anything online, including things they were told to keep secret, without losing the phone.",
      "Ask what they enjoy online and let them show you. Curiosity opens doors that checking their phone in secret closes.",
      "Warning signs: secrecy about who they talk to, an older online \"friend\", gifts or airtime from someone you do not know, distress after being online. If an adult is contacting your child inappropriately, keep the messages and report it to the police.",
    ),
  },

  {
    slug: "scenario-door-slam",
    type: "SCENARIO",
    audience: "PARENT",
    category: "Emotions",
    title: "Your teen slams the door after you ask about homework",
    body: p(
      "You asked, \"Have you finished your homework?\" Your 15-year-old shouted \"Why do you always ask that!\" and slammed the bedroom door.",
      "Response: Open the door and shout back that slamming doors is not allowed in this house.",
      "Response: Leave it for ten minutes, then knock and say: \"That reaction tells me something is going on. I am here when you want to talk. We will also talk about the door later.\"",
      "Response: Say nothing and never mention it again.",
      "Why: The second response works best. It gives space for the feeling to settle, shows you noticed something deeper than homework, and still keeps the boundary about the door. Shouting back escalates; ignoring it teaches that disrespect has no response.",
    ),
  },
  {
    slug: "scenario-lie",
    type: "SCENARIO",
    audience: "PARENT",
    category: "Discipline",
    title: "You find out your teen lied about where they were",
    body: p(
      "Your teen said they were at a classmate's house revising. A neighbour mentions seeing them in town with friends.",
      "Response: Confront them the moment they walk in, in front of the family, and take their phone for a month.",
      "Response: Wait for a private moment and say: \"I know you were in town, not revising. I am more worried about the lie than the trip. Help me understand why you felt you could not tell me.\"",
      "Response: Set a trap by asking detailed questions to see whether they lie again.",
      "Why: The second response addresses the real problem, which is that your teen did not feel able to be honest. It keeps your dignity and theirs, opens the door to the truth, and still allows a fair consequence afterwards. Public confrontation and traps produce better lies, not more honesty.",
    ),
  },
  {
    slug: "scenario-never-listen",
    type: "SCENARIO",
    audience: "PARENT",
    category: "Emotions",
    title: "Your teen says: \"You never listen to me\"",
    body: p(
      "In the middle of a disagreement about chores, your teen says, \"You never listen to me, you just talk.\"",
      "Response: \"That is not true, I listen all the time.\"",
      "Response: \"Okay. I am listening now. Tell me what you want me to understand, and I will not interrupt.\" Then actually stay quiet until they finish.",
      "Response: \"When you start doing your chores, then I will listen.\"",
      "Why: The second response takes the complaint seriously without arguing about whether it is fair. It is the only one that gives the teen the experience of being heard, which is what they asked for. Defending yourself or adding conditions proves their point.",
    ),
  },
  {
    slug: "scenario-grades",
    type: "SCENARIO",
    audience: "PARENT",
    category: "School",
    title: "Your teen's grades dropped this term",
    body: p(
      "The report card shows a clear drop in three subjects. Last term everything was fine.",
      "Response: \"What happened? Do you know how much these school fees cost?\"",
      "Response: \"I noticed the marks dropped. That is not like you. What changed this term, at school or anywhere else?\"",
      "Response: Say nothing about it to avoid upsetting them.",
      "Why: A sudden drop usually has a cause: a problem with a teacher or friends, trouble at home, health, or something online. The second response treats the marks as information rather than as a verdict and invites the real story. Guilt about fees closes the conversation; silence leaves the problem to grow.",
    ),
  },

  {
    slug: "opener-dont-know-how",
    type: "OPENER",
    audience: "TEEN",
    category: "Starting",
    title: "How to start when you don't know how",
    body: p(
      "Sometimes the hardest part is the first sentence. You do not need the perfect words. You need a door-opener that tells your parent something is coming.",
      "Try one of these:",
      "- \"Can I tell you something without you reacting straight away?\"",
      "- \"There is something I have wanted to say for a while. Can we talk after dinner?\"",
      "- \"I am not sure how to say this, so I might say it badly.\"",
      "Pick a moment when they are not busy or tired: a walk, washing dishes together, a car or bus ride where you sit side by side. Side by side is easier than face to face.",
      "If talking out loud feels impossible, write it. A note or a message that says \"I want to talk about this but I find it hard to say\" is a real conversation starter. You can also show them something in this app.",
    ),
  },
  {
    slug: "opener-school-struggle",
    type: "OPENER",
    audience: "TEEN",
    category: "School",
    title: "Telling your parent you are struggling at school",
    body: p(
      "Many teens hide school problems because they are afraid of disappointing their parents, especially when the family is paying fees. But problems grow in the dark, and most parents would rather know early.",
      "A way to say it:",
      "- Start with what you are doing: \"I have been trying hard in maths, but I am not getting it.\"",
      "- Say what you need: \"I think I need help from someone, maybe a classmate or extra lessons.\"",
      "- If marks have dropped: \"My marks went down this term and I want to tell you why before you see the report.\"",
      "If the problem is a teacher or other students, say so plainly. That is not a complaint about you; it is information your parent needs to act on.",
      "You could add: \"I am telling you because I trust you to help me, not to shout at me.\" It reminds both of you what kind of conversation this is.",
    ),
  },
  {
    slug: "opener-too-strict",
    type: "OPENER",
    audience: "TEEN",
    category: "Feelings",
    title: "When you feel they are too strict",
    body: p(
      "Arguing about a rule in the heat of the moment almost never changes it. Asking to discuss it calmly, at a different time, sometimes does.",
      "Steps that work:",
      "- Choose a calm moment, not right after a no.",
      "- Show you understand their reason first: \"I know you want me home early because you worry about safety.\"",
      "- Make a specific request with a plan: \"Could I stay until 7 on Saturdays if I message you when I leave?\"",
      "- Accept the answer for now, even if it is still no. Parents who see you handle a no calmly are more likely to say yes next time.",
      "Respect does not mean silence. In many of our families, young people are expected not to question elders. You can still raise something respectfully: \"May I share how I see it?\" is a good sentence to practise.",
    ),
  },
  {
    slug: "opener-mistake",
    type: "OPENER",
    audience: "TEEN",
    category: "Mistakes",
    title: "Admitting a mistake before they find out",
    body: p(
      "Telling your parent first is almost always better than them finding out from someone else. It shows maturity, and it usually means a smaller consequence.",
      "A simple structure:",
      "- What happened, in one or two sentences, without excuses.",
      "- What you have already done or will do to fix it.",
      "- What you learned.",
      "For example: \"I lost the money you gave me for the school trip. I think it fell out of my bag on the bus. I am sorry. I have asked the school if I can pay later and I will keep money in my inside pocket from now on.\"",
      "Expect them to be upset. That is allowed. Let them react, then say: \"I understand you are angry. I told you because I wanted to be honest.\" Most parents calm down faster when they see honesty.",
    ),
  },

  {
    slug: "story-thought-mum-angry",
    type: "TEEN_STORY",
    audience: "BOTH",
    category: "Feelings",
    title: "I thought my mum would be angry",
    body: p(
      "I am 16. For weeks I felt heavy, like I was carrying a bag of stones. I was sleeping badly and I stopped laughing with my friends. I was sure that if I told my mum she would say I was lazy or ungrateful.",
      "One evening she asked why I was so quiet. I nearly said \"nothing\". Instead I said, \"I do not feel okay and I do not know why.\" She stopped what she was doing and sat down next to me. She did not say anything clever. She just asked me to tell her more.",
      "Later she took me to the health centre and we talked to someone there. It did not fix everything in one day, but the bag of stones got lighter because I was not carrying it alone.",
      "What I would tell other teens: the sentence \"I do not feel okay\" is enough. You do not need to explain everything at once.",
      "This story is a composite written for NURTURE; it does not describe a real, identifiable person.",
    ),
  },
  {
    slug: "story-failed-exam",
    type: "TEEN_STORY",
    audience: "BOTH",
    category: "School",
    title: "The exam I failed",
    body: p(
      "I failed an end-of-term exam in a subject my father cares about. I hid the paper for two weeks. Every time he came home I felt sick.",
      "In the end I showed him before he could find it. I said, \"I failed this. I did not study the way I should have. I want to do better and I need help with how to revise.\" My voice was shaking.",
      "He was quiet for a long time. Then he said he had failed an exam once too and nobody had ever helped him plan. We made a timetable together. He still checks it on Sundays, which is annoying, but my marks went up and I stopped feeling sick when he came home.",
      "What I learned: the two weeks of hiding were worse than the five minutes of telling.",
      "This story is a composite written for NURTURE; it does not describe a real, identifiable person.",
    ),
  },
  {
    slug: "story-dinner-silence",
    type: "TEEN_STORY",
    audience: "BOTH",
    category: "Family",
    title: "Why I stopped talking at dinner",
    body: p(
      "At some point I stopped talking at dinner. My parents thought I was being rude. The truth was that every time I said something, it turned into a lesson or a question about school, so it was easier to say nothing.",
      "My aunt noticed and asked me about it when we were alone. I told her. She must have spoken to my parents, because a few days later my mum said, \"At dinner tonight, no school questions. Tell me something funny that happened instead.\"",
      "It felt strange at first. Now dinner is sometimes the best part of the day. I still get the school questions, but at other times, and I mind them less.",
      "What I would tell parents: if we go quiet, it is not always disrespect. Sometimes it is that talking stopped feeling safe. Changing one small thing can bring it back.",
      "This story is a composite written for NURTURE; it does not describe a real, identifiable person.",
    ),
  },
  {
    slug: "story-money-worries",
    type: "TEEN_STORY",
    audience: "BOTH",
    category: "Family",
    title: "Asking my dad about money worries",
    body: p(
      "I could tell something was wrong at home. My parents whispered about fees and stopped buying some things. Nobody said anything to me, so I imagined the worst: that I would have to leave school.",
      "I asked my dad directly one Saturday: \"Are we okay with money? I would rather know.\" He looked surprised, then he explained that things were tight for a few months but that my school was not in danger. He said he had not told me because he did not want me to worry.",
      "Knowing the truth was a relief, even though it was not all good news. I started switching off lights and I stopped asking for things for a while. He noticed and thanked me.",
      "What I learned: adults sometimes hide things to protect us, and asking a direct, respectful question can be a gift to everyone.",
      "This story is a composite written for NURTURE; it does not describe a real, identifiable person.",
    ),
  },
];

export const starters: StarterSeed[] = [
  { key: "day-best-hardest", category: "Everyday", text: "What was the best part of your day, and what was the hardest?" },
  { key: "your-age-worries", category: "Family", text: "When you were my age, what did you worry about most?" },
  { key: "wish-understood", category: "Feelings", text: "Is there something you wish I understood better about you?" },
  { key: "proud-at-school", category: "School", text: "What is one thing at school you are proud of this week?", resourceSlug: "guide-school-pressure" },
  { key: "change-one-rule", category: "Family", text: "If you could change one rule at home, which would it be and why?", resourceSlug: "guide-discipline" },
  { key: "friends-talk-about", category: "Everyday", text: "What do your friends talk about that we never talk about at home?", resourceSlug: "topic-relationships" },
  { key: "calm-down", category: "Feelings", text: "What helps you calm down when you are upset?", resourceSlug: "guide-big-feelings" },
  { key: "social-media-wrong", category: "Online life", text: "What do you think adults get wrong about social media?", resourceSlug: "topic-online-safety" },
  { key: "who-do-you-go-to", category: "Feelings", text: "Who do you go to when something is wrong? Can I be one of those people?", resourceSlug: "topic-mental-health" },
  { key: "five-years", category: "Future", text: "What would you like to be doing in five years?" },
  { key: "pressured-by-friends", category: "Safety", text: "Was there a time this month you felt pressured by friends?", resourceSlug: "topic-substances" },
  { key: "growing-up-questions", category: "Growing up", text: "Is there anything about growing up that you have questions about?", resourceSlug: "guide-puberty" },
];

function connectionConfig(url: string) {
  const parsed = new URL(url);
  const params = parsed.searchParams;
  const tls = params.get("sslaccept") === "strict" || params.get("ssl") === "true";
  return {
    host: parsed.hostname,
    port: parsed.port ? Number(parsed.port) : 3306,
    user: decodeURIComponent(parsed.username),
    password: decodeURIComponent(parsed.password),
    database: decodeURIComponent(parsed.pathname.replace(/^\//, "")),
    ssl: tls ? { rejectUnauthorized: true } : undefined,
    connectionLimit: 2,
    minimumIdle: 0,
  };
}

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set.");
  const prisma = new PrismaClient({ adapter: new PrismaMariaDb(connectionConfig(url)) });

  const idBySlug = new Map<string, string>();
  for (const { slug, ...data } of resources) {
    const row = await prisma.educationalResource.upsert({
      where: { slug },
      update: { ...data, isPublished: true },
      create: { slug, ...data, isPublished: true },
      select: { id: true },
    });
    idBySlug.set(slug, row.id);
  }

  for (const { key, resourceSlug, ...data } of starters) {
    const resourceId = resourceSlug ? (idBySlug.get(resourceSlug) ?? null) : null;
    await prisma.conversationStarter.upsert({
      where: { key },
      update: { ...data, resourceId },
      create: { key, ...data, resourceId },
    });
  }

  console.log(`Seeded ${resources.length} resources and ${starters.length} conversation starters.`);
  await prisma.$disconnect();
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
