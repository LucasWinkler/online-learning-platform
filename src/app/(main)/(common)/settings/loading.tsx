import { Skeleton } from "~/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-background p-6 sm:gap-5 lg:gap-6">
      <Skeleton className="h-8 w-40 sm:h-10 sm:w-60" />
      <div className="flex flex-col gap-6">
        <Skeleton className="h-52 w-full" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-56 w-full" />
      </div>
    </div>
  );
}
