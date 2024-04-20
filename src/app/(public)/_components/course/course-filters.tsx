"use client";

import type { CourseSortCriteria } from "~/server/actions/course";

import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Toggle } from "~/components/ui/toggle";

type CourseFiltersProps = {
  sort: string;
  order: string;
};

const CourseFilters = ({ sort, order }: CourseFiltersProps) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const handleSortCriteria = (value: CourseSortCriteria) => {
    const params = new URLSearchParams(searchParams ? searchParams : undefined);

    params.set("sort", value);
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleSortOrder = () => {
    const params = new URLSearchParams(searchParams ? searchParams : undefined);

    params.set("order", order === "asc" ? "desc" : "asc");
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <>
      <Select
        onValueChange={(value) =>
          handleSortCriteria(value as CourseSortCriteria)
        }
        defaultValue={sort}
      >
        <SelectTrigger aria-label="Sort by">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="popular">Most Popular</SelectItem>
          <SelectItem value="newest">Newest</SelectItem>
          <SelectItem value="recent">Recently Updated</SelectItem>
        </SelectContent>
      </Select>
      <Toggle
        variant="outline"
        aria-label="Toggle sort order"
        pressed={order === "desc"}
        onPressedChange={handleSortOrder}
      >
        {order === "asc" ? (
          <ArrowUpIcon className="h-4 w-4" />
        ) : (
          <ArrowDownIcon className="h-4 w-4" />
        )}
      </Toggle>
    </>
  );
};

export default CourseFilters;
