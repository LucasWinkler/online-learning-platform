import type { ClassValue } from "clsx";

import { Role } from "@prisma/client";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { DEFAULT_REDIRECT, INSTRUCTOR_ROUTE_PREFIX } from "~/routes";

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

export const formatCurrency = (price: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
};

export const redirectUrlFromRole = (role: Role = Role.USER) =>
  role === Role.ADMIN ? INSTRUCTOR_ROUTE_PREFIX : DEFAULT_REDIRECT;

export const toTitleCase = (str: string) => {
  return str.replace(/\b\w/g, (l) => l.toUpperCase());
};
