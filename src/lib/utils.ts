import type { ClassValue } from "clsx";

import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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
