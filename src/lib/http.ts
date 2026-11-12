import { NextResponse } from "next/server";
import { ZodError } from "zod";

export class HttpError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

export const GENERIC_ERROR = "Something went wrong. Please try again.";

export function json(data: unknown, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export function fieldErrors(error: ZodError) {
  const fields: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!fields[key]) fields[key] = issue.message;
  }
  return fields;
}

export async function readJson(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    throw new HttpError(400, "Invalid request body.");
  }
}

export function apiHandler<Args extends unknown[]>(
  handler: (...args: Args) => Promise<Response>,
) {
  return async (...args: Args): Promise<Response> => {
    try {
      return await handler(...args);
    } catch (error) {
      // Next.js signals (redirects, prerender bailouts) carry a digest and must propagate.
      if (typeof (error as { digest?: unknown })?.digest === "string") throw error;
      if (error instanceof HttpError) {
        return json({ error: error.message }, error.status);
      }
      if (error instanceof ZodError) {
        return json(
          { error: "Please fix the highlighted fields.", fields: fieldErrors(error) },
          400,
        );
      }
      const name = error instanceof Error ? error.name : "Error";
      const message = error instanceof Error ? error.message : String(error);
      console.error(`[api] ${name}: ${message}`);
      return json({ error: GENERIC_ERROR }, 500);
    }
  };
}
