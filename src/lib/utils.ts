import type { ClassValue } from "clsx";

import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const calculateCourseLengthInSeconds = (
  lessons: { length: number | null }[],
): number => {
  const totalLengthInSeconds = lessons.reduce(
    (total, lesson) => (total += lesson.length ?? 0),
    0,
  );

  return totalLengthInSeconds;
};
