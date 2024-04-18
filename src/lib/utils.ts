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

export const formatCourseLength = (lengthInSeconds: number): string => {
  const lengthInHours = lengthInSeconds / 3600;
  const hours = Math.floor(lengthInHours);
  const minutes = Math.floor((lengthInHours - hours) * 60);

  if (hours > 0 && minutes > 0) {
    return `${hours}h ${minutes}m`;
  } else if (hours > 0) {
    return `${hours}h`;
  } else {
    return `${minutes}m`;
  }
};
