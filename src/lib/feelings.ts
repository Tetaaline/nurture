export const FEELINGS = [
  { value: "HAPPY", label: "Happy", color: "#C98F00" },
  { value: "CALM", label: "Calm", color: "#2F8A7A" },
  { value: "EXCITED", label: "Excited", color: "#D0552E" },
  { value: "WORRIED", label: "Worried", color: "#6F5FBF" },
  { value: "SAD", label: "Sad", color: "#3F6FAE" },
  { value: "ANGRY", label: "Angry", color: "#B83A26" },
  { value: "STRESSED", label: "Stressed", color: "#8E5F24" },
  { value: "CONFUSED", label: "Confused", color: "#5F6873" },
] as const;

export type FeelingValue = (typeof FEELINGS)[number]["value"];

export const FEELING_VALUES = FEELINGS.map((feeling) => feeling.value) as [
  FeelingValue,
  ...FeelingValue[],
];

export function feelingInfo(value: string) {
  return FEELINGS.find((feeling) => feeling.value === value) ?? FEELINGS[7];
}
