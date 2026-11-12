export const APP_TIME_ZONE = "Africa/Kigali";

const dateTime = new Intl.DateTimeFormat("en-GB", {
  timeZone: APP_TIME_ZONE,
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const dateOnly = new Intl.DateTimeFormat("en-GB", {
  timeZone: APP_TIME_ZONE,
  weekday: "short",
  day: "numeric",
  month: "short",
  year: "numeric",
});

export function formatDateTime(date: Date | string) {
  return dateTime.format(new Date(date));
}

export function formatDate(date: Date | string) {
  return dateOnly.format(new Date(date));
}
