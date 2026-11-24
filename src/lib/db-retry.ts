// mariadb ER_GET_CONNECTION_TIMEOUT: the pool could not hand out a connection in time.
const POOL_TIMEOUT_ERRNO = 45028;
const RETRY_DELAY_MS = 500;

type ErrorLike = {
  errno?: unknown;
  code?: unknown;
  message?: unknown;
  originalCode?: unknown;
  cause?: unknown;
  meta?: { driverAdapterError?: unknown };
};

export function isPoolTimeoutError(error: unknown, depth = 0): boolean {
  if (!error || typeof error !== "object" || depth > 4) return false;
  const e = error as ErrorLike;
  if (e.errno === POOL_TIMEOUT_ERRNO) return true;
  if (String(e.originalCode) === String(POOL_TIMEOUT_ERRNO)) return true;
  // Prisma wraps unmapped driver errors as P2039 and only keeps the driver code in the message.
  if (
    e.code === "P2039" &&
    typeof e.message === "string" &&
    e.message.includes(`\`${POOL_TIMEOUT_ERRNO}\``)
  ) {
    return true;
  }
  return (
    isPoolTimeoutError(e.cause, depth + 1) ||
    isPoolTimeoutError(e.meta?.driverAdapterError, depth + 1)
  );
}

// A pool timeout means no statement was sent, so running the operation again is safe.
export async function retryOnPoolTimeout<T>(
  operation: () => Promise<T>,
  delayMs = RETRY_DELAY_MS,
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (!isPoolTimeoutError(error)) throw error;
    await new Promise((resolve) => setTimeout(resolve, delayMs));
    return operation();
  }
}
