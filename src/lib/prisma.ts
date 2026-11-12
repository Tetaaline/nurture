import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../../generated/prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

// The mariadb driver does not understand Prisma's `sslaccept=strict` (which TiDB
// Cloud requires), so the URL is turned into an explicit config with TLS on.
function connectionConfig(url: string) {
  const parsed = new URL(url);
  const params = parsed.searchParams;
  const tls =
    params.get("sslaccept") === "strict" ||
    params.get("ssl") === "true" ||
    params.get("sslmode") === "require";

  return {
    host: parsed.hostname,
    port: parsed.port ? Number(parsed.port) : 3306,
    user: decodeURIComponent(parsed.username),
    password: decodeURIComponent(parsed.password),
    database: decodeURIComponent(parsed.pathname.replace(/^\//, "")),
    ssl: tls ? { rejectUnauthorized: true } : undefined,
    connectionLimit: 3,
    minimumIdle: 0,
    idleTimeout: 60,
    connectTimeout: 10_000,
  };
}

function createPrismaClient() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set.");
  }
  return new PrismaClient({ adapter: new PrismaMariaDb(connectionConfig(url)) });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
