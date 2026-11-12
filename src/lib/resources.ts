import type { Audience, ResourceType, Role } from "@generated/prisma/enums";
import { prisma } from "./prisma";

export type Section = {
  key: string;
  type: ResourceType;
  audiences: Audience[] | null;
  title: string;
  lead: string;
  basePath: string;
};

const parentSections: Record<string, Section> = {
  guides: {
    key: "guides",
    type: "GUIDE",
    audiences: ["PARENT", "BOTH"],
    title: "Parent guides",
    lead: "Practical guidance on emotions, puberty, discipline and school.",
    basePath: "/parent/understand/guides",
  },
  sensitive: {
    key: "sensitive",
    type: "SENSITIVE_TOPIC",
    audiences: ["PARENT", "BOTH"],
    title: "Sensitive conversations",
    lead: "How to open the hard topics, with starters you can use tonight.",
    basePath: "/parent/understand/sensitive",
  },
  scenarios: {
    key: "scenarios",
    type: "SCENARIO",
    audiences: ["PARENT", "BOTH"],
    title: "What would you say?",
    lead: "Real situations, a few possible responses, and why one works best.",
    basePath: "/parent/understand/scenarios",
  },
  stories: {
    key: "stories",
    type: "TEEN_STORY",
    audiences: null,
    title: "Teen stories",
    lead: "Short stories, in teens' own words, about talking to a parent.",
    basePath: "/parent/understand/stories",
  },
};

const teenSections: Record<string, Section> = {
  openers: {
    key: "openers",
    type: "OPENER",
    audiences: ["TEEN", "BOTH"],
    title: "How do I bring it up?",
    lead: "Ways to start the conversation you have been putting off.",
    basePath: "/teen/express/openers",
  },
  stories: {
    key: "stories",
    type: "TEEN_STORY",
    audiences: null,
    title: "Teen stories",
    lead: "Short stories from teens who found the words.",
    basePath: "/teen/express/stories",
  },
};

export function sectionsFor(role: Role) {
  return Object.values(role === "PARENT" ? parentSections : teenSections);
}

export function getSection(role: Role, key: string): Section | null {
  return (role === "PARENT" ? parentSections : teenSections)[key] ?? null;
}

export function startersPath(role: Role) {
  return role === "PARENT" ? "/parent/understand/starters" : "/teen/express/starters";
}

function whereFor(section: Section) {
  return {
    type: section.type,
    isPublished: true,
    ...(section.audiences && { audience: { in: section.audiences } }),
  };
}

export async function listResources(section: Section, category?: string) {
  return prisma.educationalResource.findMany({
    where: { ...whereFor(section), ...(category && { category }) },
    orderBy: [{ category: "asc" }, { title: "asc" }],
    select: { id: true, title: true, category: true, body: true },
  });
}

export async function listCategories(section: Section) {
  const rows = await prisma.educationalResource.findMany({
    where: whereFor(section),
    distinct: ["category"],
    orderBy: { category: "asc" },
    select: { category: true },
  });
  return rows.map((row) => row.category);
}

export function getResource(section: Section, id: string) {
  if (!/^[a-z0-9]{10,40}$/.test(id)) return Promise.resolve(null);
  return prisma.educationalResource.findFirst({
    where: { id, ...whereFor(section) },
    select: {
      id: true,
      title: true,
      category: true,
      body: true,
      type: true,
      starters: { select: { id: true, text: true }, orderBy: { text: "asc" } },
    },
  });
}

export function listStartersWithTopics() {
  return prisma.conversationStarter.findMany({
    orderBy: [{ category: "asc" }, { text: "asc" }],
    select: {
      id: true,
      text: true,
      category: true,
      resource: {
        select: { id: true, title: true, type: true, audience: true, isPublished: true },
      },
    },
  });
}

export function excerpt(body: string, max = 140) {
  const firstParagraph = body.split(/\n\s*\n/)[0]?.replace(/^- /, "") ?? "";
  return firstParagraph.length > max ? `${firstParagraph.slice(0, max).trimEnd()}…` : firstParagraph;
}
