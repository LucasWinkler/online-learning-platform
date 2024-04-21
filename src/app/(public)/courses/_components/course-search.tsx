"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";

type CourseSearchProps = {
  className?: string;
};

const CourseSearch = ({ className }: CourseSearchProps) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const params = new URLSearchParams(searchParams ?? undefined);
  const currentSearch = params.get("search") ?? "";

  const handleSearch = useDebouncedCallback((search: string) => {
    const trimmedSearch = search.trim();
    const isOnlyWhitespace = search.length !== 0 && trimmedSearch.length === 0;

    if (isOnlyWhitespace) {
      return;
    }

    if (trimmedSearch.length === 0) {
      params.delete("search");
    } else if (trimmedSearch.length >= 2) {
      params.set("search", trimmedSearch);
    } else {
      return;
    }

    params.delete("page");
    router.replace(`${pathname}?${params.toString()}`);
  }, 500);

  return (
    <Input
      className={cn("", className)}
      type="text"
      onChange={(e) => handleSearch(e.target.value)}
      defaultValue={currentSearch}
      placeholder="Search..."
    />
  );
};

export default CourseSearch;
