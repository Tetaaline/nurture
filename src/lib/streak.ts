export const STREAK_TIME_ZONE = "Africa/Kigali";

const DAY_MS = 86_400_000;
const WEEK_MS = 7 * DAY_MS;
const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const formatter = new Intl.DateTimeFormat("en-US", {
  timeZone: STREAK_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  weekday: "short",
});

function localCalendarDay(date: Date) {
  const parts = Object.fromEntries(
    formatter.formatToParts(date).map((part) => [part.type, part.value]),
  );
  const dayUtc = Date.UTC(Number(parts.year), Number(parts.month) - 1, Number(parts.day));
  return { dayUtc, weekday: WEEKDAYS.indexOf(parts.weekday) };
}

// Weeks run Monday to Sunday in Kigali time. Consecutive weeks differ by exactly 1.
export function weekIndex(date: Date): number {
  const { dayUtc, weekday } = localCalendarDay(date);
  return Math.floor((dayUtc - weekday * DAY_MS) / WEEK_MS);
}

export function calculateStreak(dates: Date[], now: Date): number {
  const countingWeeks = new Set(dates.map(weekIndex));
  const thisWeek = weekIndex(now);
  let cursor = countingWeeks.has(thisWeek) ? thisWeek : thisWeek - 1;
  let streak = 0;
  while (countingWeeks.has(cursor)) {
    streak += 1;
    cursor -= 1;
  }
  return streak;
}

export function talkedThisWeek(dates: Date[], now: Date): boolean {
  const thisWeek = weekIndex(now);
  return dates.some((date) => weekIndex(date) === thisWeek);
}
