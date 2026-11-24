import { connection } from "next/server";
import { json } from "@/lib/http";
import { prisma } from "@/lib/prisma";

// Public and data-free: an uptime monitor calls this to keep the TiDB Starter database awake.
export async function GET() {
  await connection();
  try {
    // The Prisma client already retries once on a pool timeout (src/lib/db-retry.ts).
    await prisma.$queryRaw`SELECT 1`;
    return json({ status: "ok" });
  } catch (error) {
    console.error(`[health] ${error instanceof Error ? error.name : "Error"}`);
    return json({ status: "error" }, 503);
  }
}
