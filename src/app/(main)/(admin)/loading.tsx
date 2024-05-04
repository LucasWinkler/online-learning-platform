import { LoaderCircleIcon } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex h-screen items-center justify-center">
        <LoaderCircleIcon className="size-12 animate-spin text-primary" />
      </div>
    </div>
  );
}
