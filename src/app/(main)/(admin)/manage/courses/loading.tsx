import { PrimaryHeading } from "~/components/primary-heading";
import { Skeleton } from "~/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-background p-4 xxs:p-5 xs:p-6 sm:gap-5 lg:gap-6 xl:gap-9">
      <div className="flex flex-col gap-2">
        <div className="flex flex-col items-start justify-between gap-2 xs:flex-row xs:items-center xs:gap-4">
          <PrimaryHeading>Courses</PrimaryHeading>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-full max-w-sm" />
          <Skeleton className="ml-auto h-8 w-[4.75rem]" />
          <Skeleton className="h-8 w-[4.75rem]" />
        </div>
        <div className="flex flex-col gap-3">
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
        </div>
      </div>
    </div>
  );
}
