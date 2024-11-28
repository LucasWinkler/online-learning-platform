import { BookIcon, ClockIcon, UsersIcon } from "lucide-react";

import { formatCourseLength } from "~/lib/utils";

type CourseStatsProps = {
  chaptersCount: number;
};

export const CourseStats = ({ chaptersCount }: CourseStatsProps) => (
  <div className="flex flex-row flex-wrap justify-between gap-2">
    <span className="flex items-center gap-1 text-sm text-muted-foreground">
      <ClockIcon className="size-4 shrink-0 text-amber-500" />
      {formatCourseLength(72512)}
    </span>
    <span className="flex items-center gap-1 text-sm text-muted-foreground">
      <BookIcon className="size-4 shrink-0 text-purple-500" />
      {chaptersCount} chapters
    </span>
    <span className="flex items-center gap-1 text-sm text-muted-foreground">
      <UsersIcon className="size-4 shrink-0 text-blue-500" />
      {50} enrolled
    </span>
  </div>
);
