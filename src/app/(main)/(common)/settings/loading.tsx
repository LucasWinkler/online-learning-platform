import { Skeleton } from "~/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-background p-6 sm:gap-5 lg:gap-6">
      <Skeleton className="h-8 w-40 sm:h-10 sm:w-60" />
      <div className="flex flex-col gap-6">
        <Skeleton className="flex w-full flex-col gap-4 p-4 sm:p-6">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-9 w-full" />
          <Skeleton className="mt-2 h-8 w-full" />
        </Skeleton>
        <Skeleton className="flex w-full flex-col gap-5 p-4 sm:p-6">
          <Skeleton className="h-8 w-36" />
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="mt-2 h-9 w-full" />
        </Skeleton>
        <Skeleton className="flex w-full flex-col gap-3 p-4 sm:p-6">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="mt-2 h-7 w-full" />
        </Skeleton>
      </div>
    </div>
  );
}
