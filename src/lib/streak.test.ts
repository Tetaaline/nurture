import { describe, expect, it } from "vitest";
import { calculateStreak, talkedThisWeek, weekIndex } from "./streak";

// Kigali is UTC+2 all year. "kigali" builds an instant from a Kigali wall-clock time.
function kigali(iso: string) {
  return new Date(`${iso}+02:00`);
}

describe("calculateStreak", () => {
  it("follows the SRS example across weeks 40 to 44 of 2025", () => {
    const records = [
      kigali("2025-10-01T18:00:00"), // ISO week 40
      kigali("2025-10-08T18:00:00"), // week 41
      kigali("2025-10-15T18:00:00"), // week 42
    ];
    expect(calculateStreak(records, kigali("2025-10-22T12:00:00"))).toBe(3); // Wednesday, week 43

    // Week 43 passes with no conversation.
    expect(calculateStreak(records, kigali("2025-10-27T09:00:00"))).toBe(0); // Monday, week 44

    const withWeek44 = [...records, kigali("2025-10-28T20:00:00")];
    expect(calculateStreak(withWeek44, kigali("2025-10-29T09:00:00"))).toBe(1);
  });

  it("returns 0 when there are no conversations", () => {
    expect(calculateStreak([], kigali("2025-10-22T12:00:00"))).toBe(0);
  });

  it("counts several conversations in one week once", () => {
    const records = [
      kigali("2025-10-13T08:00:00"),
      kigali("2025-10-14T08:00:00"),
      kigali("2025-10-19T23:00:00"),
    ];
    expect(calculateStreak(records, kigali("2025-10-19T23:30:00"))).toBe(1);
  });

  it("keeps last week's streak alive while this week is still empty", () => {
    const records = [kigali("2025-10-08T18:00:00"), kigali("2025-10-15T18:00:00")];
    expect(calculateStreak(records, kigali("2025-10-20T00:00:01"))).toBe(2);
  });

  it("treats Sunday 23:59 and Monday 00:00 Kigali as different weeks", () => {
    const sundayNight = new Date("2025-10-19T21:59:00Z"); // 23:59 Kigali, week 42
    const mondayMorning = new Date("2025-10-19T22:00:00Z"); // 00:00 Kigali Monday, week 43
    expect(weekIndex(mondayMorning) - weekIndex(sundayNight)).toBe(1);
    expect(calculateStreak([sundayNight], mondayMorning)).toBe(1);
    expect(calculateStreak([sundayNight], new Date("2025-10-26T22:00:00Z"))).toBe(0);
  });

  it("ignores conversations recorded in the future weeks", () => {
    const records = [kigali("2025-11-05T10:00:00")];
    expect(calculateStreak(records, kigali("2025-10-22T12:00:00"))).toBe(0);
  });
});

describe("talkedThisWeek", () => {
  it("is true only for a conversation in the current Kigali week", () => {
    const now = kigali("2025-10-22T12:00:00");
    expect(talkedThisWeek([kigali("2025-10-20T07:00:00")], now)).toBe(true);
    expect(talkedThisWeek([kigali("2025-10-19T23:59:00")], now)).toBe(false);
  });
});
