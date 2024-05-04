import { LoaderCircleIcon } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex h-[calc(100vh-var(--header-height)-4rem)] items-center justify-center">
      <div className="flex h-full items-center justify-center">
        <LoaderCircleIcon className="size-12 animate-spin text-primary" />
      </div>
    </div>
  );
}
