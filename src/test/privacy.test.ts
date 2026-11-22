import { beforeEach, describe, expect, it, vi } from "vitest";
import * as checkins from "@/app/api/checkins/route";
import * as journal from "@/app/api/journal/route";
import * as journalEntry from "@/app/api/journal/[id]/route";
import { fakeDb } from "./fake-prisma";

const session = vi.hoisted(() => ({ clerkId: null as string | null }));

vi.mock("@clerk/nextjs/server", () => ({
  auth: async () => ({ userId: session.clerkId }),
}));
vi.mock("next/server", async (importOriginal) => ({
  ...(await importOriginal<typeof import("next/server")>()),
  connection: async () => {},
}));
vi.mock("@/lib/prisma", async () => ({ prisma: (await import("./fake-prisma")).fakeDb.prisma }));

type Ids = { parent: string; teenA: string; teenB: string; entryA: string };
let ids: Ids;

async function createUser(clerkId: string, displayName: string, role: "PARENT" | "TEEN") {
  const user = await fakeDb.prisma.user.create({
    data: { authProviderId: clerkId, displayName, email: `${clerkId}@example.com`, role },
  });
  return user.id as string;
}

function signInAs(clerkId: string | null) {
  session.clerkId = clerkId;
}

function params(id: string) {
  return { params: Promise.resolve({ id }) };
}

function request(method: string, body?: unknown) {
  return new Request("http://localhost/api", {
    method,
    headers: { "content-type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

function entryA() {
  return fakeDb.tables.journalEntry.find((e) => e.id === ids.entryA);
}

beforeEach(async () => {
  fakeDb.reset();
  const parent = await createUser("clerk_parent", "Grace", "PARENT");
  const teenA = await createUser("clerk_teen_a", "Keza", "TEEN");
  const teenB = await createUser("clerk_teen_b", "Mugisha", "TEEN");
  await fakeDb.prisma.family.create({ data: { parentId: parent, teenId: teenA } });

  const entry = await fakeDb.prisma.journalEntry.create({
    data: { ownerId: teenA, title: "Private", body: "Only Keza should read this." },
  });
  await fakeDb.prisma.feelingsCheckIn.create({
    data: { ownerId: teenA, feeling: "WORRIED", note: "Exams next week." },
  });
  ids = { parent, teenA, teenB, entryA: entry.id as string };
});

describe("journal privacy", () => {
  it("lets the owner read, edit and delete their own entry", async () => {
    signInAs("clerk_teen_a");

    const list = await journal.GET();
    expect((await list.json()).entries).toHaveLength(1);

    const read = await journalEntry.GET(request("GET"), params(ids.entryA));
    expect(read.status).toBe(200);
    expect(read.headers.get("cache-control")).toBe("no-store");

    const edit = await journalEntry.PATCH(request("PATCH", { title: "Renamed" }), params(ids.entryA));
    expect(edit.status).toBe(200);
    expect(entryA()?.title).toBe("Renamed");

    const remove = await journalEntry.DELETE(request("DELETE"), params(ids.entryA));
    expect(remove.status).toBe(200);
    expect(entryA()).toBeUndefined();
  });

  describe("a parent, even of the linked teen", () => {
    beforeEach(() => signInAs("clerk_parent"));

    it("cannot list journal entries", async () => {
      const res = await journal.GET();
      expect(res.status).toBe(403);
      expect(JSON.stringify(await res.json())).not.toContain("Only Keza");
    });

    it("cannot read the teen's entry", async () => {
      const res = await journalEntry.GET(request("GET"), params(ids.entryA));
      expect(res.status).toBe(403);
      expect(JSON.stringify(await res.json())).not.toContain("Only Keza");
    });

    it("cannot edit the teen's entry", async () => {
      const res = await journalEntry.PATCH(request("PATCH", { body: "Changed" }), params(ids.entryA));
      expect(res.status).toBe(403);
      expect(entryA()?.body).toBe("Only Keza should read this.");
    });

    it("cannot delete the teen's entry", async () => {
      const res = await journalEntry.DELETE(request("DELETE"), params(ids.entryA));
      expect(res.status).toBe(403);
      expect(entryA()).toBeDefined();
    });

    it("cannot create a journal entry", async () => {
      const res = await journal.POST(request("POST", { body: "Hello" }));
      expect(res.status).toBe(403);
      expect(fakeDb.tables.journalEntry).toHaveLength(1);
    });
  });

  describe("another teen", () => {
    beforeEach(() => signInAs("clerk_teen_b"));

    it("does not see the entry in their own list", async () => {
      const res = await journal.GET();
      expect(res.status).toBe(200);
      expect((await res.json()).entries).toEqual([]);
    });

    it("gets not found when reading it", async () => {
      const res = await journalEntry.GET(request("GET"), params(ids.entryA));
      expect(res.status).toBe(404);
      expect(JSON.stringify(await res.json())).not.toContain("Only Keza");
    });

    it("gets not found when editing it, and nothing changes", async () => {
      const res = await journalEntry.PATCH(request("PATCH", { body: "Changed" }), params(ids.entryA));
      expect(res.status).toBe(404);
      expect(entryA()?.body).toBe("Only Keza should read this.");
    });

    it("gets not found when deleting it, and it stays", async () => {
      const res = await journalEntry.DELETE(request("DELETE"), params(ids.entryA));
      expect(res.status).toBe(404);
      expect(entryA()).toBeDefined();
    });

    it("creates entries owned by themselves, whatever the request says", async () => {
      const res = await journal.POST(request("POST", { body: "Mine", ownerId: ids.teenA }));
      expect(res.status).toBe(201);
      const created = fakeDb.tables.journalEntry.find((e) => e.body === "Mine");
      expect(created?.ownerId).toBe(ids.teenB);
    });
  });

  it("rejects signed-out requests with 401", async () => {
    signInAs(null);
    expect((await journal.GET()).status).toBe(401);
    expect((await journalEntry.GET(request("GET"), params(ids.entryA))).status).toBe(401);
  });
});

describe("check-in privacy", () => {
  it("shows the owner their own check-ins", async () => {
    signInAs("clerk_teen_a");
    const res = await checkins.GET();
    expect(res.status).toBe(200);
    expect(res.headers.get("cache-control")).toBe("no-store");
    expect((await res.json()).checkIns).toHaveLength(1);
  });

  it("blocks a parent from reading check-ins", async () => {
    signInAs("clerk_parent");
    const res = await checkins.GET();
    expect(res.status).toBe(403);
    expect(JSON.stringify(await res.json())).not.toContain("Exams");
  });

  it("blocks a parent from creating check-ins", async () => {
    signInAs("clerk_parent");
    const res = await checkins.POST(request("POST", { feeling: "HAPPY" }));
    expect(res.status).toBe(403);
    expect(fakeDb.tables.feelingsCheckIn).toHaveLength(1);
  });

  it("does not show one teen another teen's check-ins", async () => {
    signInAs("clerk_teen_b");
    const res = await checkins.GET();
    expect(res.status).toBe(200);
    expect((await res.json()).checkIns).toEqual([]);
  });

  it("saves a check-in to the signed-in teen, whatever the request says", async () => {
    signInAs("clerk_teen_b");
    const res = await checkins.POST(request("POST", { feeling: "CALM", ownerId: ids.teenA }));
    expect(res.status).toBe(201);
    expect(fakeDb.tables.feelingsCheckIn.at(-1)?.ownerId).toBe(ids.teenB);
  });
});
