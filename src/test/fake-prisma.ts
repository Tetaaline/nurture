type Row = Record<string, unknown>;
type Args = {
  where?: Row;
  data?: Row;
  select?: Row;
  orderBy?: Record<string, "asc" | "desc">;
  take?: number;
};
type TableName =
  | "user"
  | "family"
  | "invitationCode"
  | "redemptionAttempt"
  | "journalEntry"
  | "feelingsCheckIn";

const TABLES: TableName[] = [
  "user",
  "family",
  "invitationCode",
  "redemptionAttempt",
  "journalEntry",
  "feelingsCheckIn",
];

const DEFAULTS: Partial<Record<TableName, Row>> = {
  invitationCode: { status: "ACTIVE", redeemedById: null },
  family: { teenId: null },
};

const RELATIONS: Partial<Record<TableName, Record<string, { table: TableName; key: string }>>> = {
  family: {
    parent: { table: "user", key: "parentId" },
    teen: { table: "user", key: "teenId" },
  },
};

function isRange(value: unknown): value is { gt?: Date; gte?: Date; lt?: Date; lte?: Date } {
  return (
    typeof value === "object" &&
    value !== null &&
    !(value instanceof Date) &&
    ["gt", "gte", "lt", "lte"].some((op) => op in value)
  );
}

function time(value: unknown) {
  return value instanceof Date ? value.getTime() : Number(value);
}

function matches(row: Row, where: Row = {}) {
  return Object.entries(where).every(([key, expected]) => {
    const actual = row[key];
    if (isRange(expected)) {
      const a = time(actual);
      return (
        (expected.gt === undefined || a > time(expected.gt)) &&
        (expected.gte === undefined || a >= time(expected.gte)) &&
        (expected.lt === undefined || a < time(expected.lt)) &&
        (expected.lte === undefined || a <= time(expected.lte))
      );
    }
    if (expected instanceof Date) return time(actual) === expected.getTime();
    return (actual ?? null) === (expected ?? null);
  });
}

export function createFakePrisma() {
  const tables = Object.fromEntries(TABLES.map((t) => [t, [] as Row[]])) as Record<TableName, Row[]>;
  let nextId = 1;

  function project(table: TableName, row: Row, select?: Row): Row {
    if (!select) return { ...row };
    const out: Row = {};
    for (const [key, value] of Object.entries(select)) {
      const relation = RELATIONS[table]?.[key];
      if (relation) {
        const related = tables[relation.table].find((r) => r.id === row[relation.key]);
        out[key] = related
          ? project(relation.table, related, (value as { select?: Row }).select)
          : null;
      } else if (value) {
        out[key] = row[key];
      }
    }
    return out;
  }

  function sorted(rows: Row[], orderBy?: Args["orderBy"]) {
    if (!orderBy) return rows;
    const [[field, direction]] = Object.entries(orderBy);
    const sign = direction === "desc" ? -1 : 1;
    return [...rows].sort((a, b) => sign * (time(a[field]) - time(b[field])));
  }

  function model(table: TableName) {
    const rows = () => tables[table];
    return {
      async findUnique({ where, select }: Args) {
        const row = rows().find((r) => matches(r, where));
        return row ? project(table, row, select) : null;
      },
      async findFirst({ where, select, orderBy }: Args) {
        const row = sorted(rows().filter((r) => matches(r, where)), orderBy)[0];
        return row ? project(table, row, select) : null;
      },
      async findMany({ where, select, orderBy, take }: Args = {}) {
        const found = sorted(rows().filter((r) => matches(r, where)), orderBy);
        return found.slice(0, take ?? found.length).map((r) => project(table, r, select));
      },
      async create({ data, select }: Args) {
        const now = new Date();
        const row: Row = {
          id: `c${String(nextId++).padStart(12, "0")}`,
          createdAt: now,
          ...(table === "journalEntry" && { updatedAt: now }),
          ...DEFAULTS[table],
          ...data,
        };
        rows().push(row);
        return project(table, row, select);
      },
      async update({ where, data, select }: Args) {
        const row = rows().find((r) => matches(r, where));
        if (!row) throw new Error(`${table} not found`);
        Object.assign(row, data, table === "journalEntry" && { updatedAt: new Date() });
        return project(table, row, select);
      },
      async updateMany({ where, data }: Args) {
        const found = rows().filter((r) => matches(r, where));
        for (const row of found) Object.assign(row, data);
        return { count: found.length };
      },
      async delete({ where }: Args) {
        const index = rows().findIndex((r) => matches(r, where));
        if (index === -1) throw new Error(`${table} not found`);
        return rows().splice(index, 1)[0];
      },
    };
  }

  const prisma = {
    ...(Object.fromEntries(TABLES.map((t) => [t, model(t)])) as Record<TableName, ReturnType<typeof model>>),
    async $transaction(arg: unknown): Promise<unknown> {
      if (Array.isArray(arg)) return Promise.all(arg);
      // Interactive transactions roll back on throw, like the real database.
      const snapshot = structuredClone(tables);
      try {
        return await (arg as (tx: unknown) => Promise<unknown>)(prisma);
      } catch (error) {
        for (const t of TABLES) tables[t] = snapshot[t];
        throw error;
      }
    },
  };

  function reset() {
    for (const t of TABLES) tables[t] = [];
    nextId = 1;
  }

  return { prisma, tables, reset };
}

export const fakeDb = createFakePrisma();
