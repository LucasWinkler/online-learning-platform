"use client";

import { usePathname, useSearchParams } from "next/navigation";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination";
import { cn } from "~/lib/utils";

type CoursePaginationProps = {
  total: number;
  page: number;
  limit: number;
  className?: string;
};

const CoursePagination = ({
  className,
  total,
  page,
  limit,
}: CoursePaginationProps) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const params = new URLSearchParams(searchParams ?? undefined);
  const totalPages = Math.ceil(total / limit);

  const handleButtonClick = (pageNumber: number | string) => {
    params.set("page", pageNumber.toString());

    return `${pathname}?${params.toString()}`;
  };

  const renderPageNumbers = () => {
    const items = [];
    const pagesToShow = Math.min(totalPages, 3);
    for (let pages = 1; pages <= pagesToShow; pages++) {
      items.push(
        <PaginationItem key={pages}>
          <PaginationLink
            href={handleButtonClick(pages)}
            isActive={page == pages}
          >
            {pages}
          </PaginationLink>
        </PaginationItem>,
      );
    }
    if (totalPages > 3) {
      items.push(
        <PaginationItem key="ellipsis">
          <PaginationEllipsis />
        </PaginationItem>,
        <PaginationItem key={totalPages}>
          <PaginationLink
            href={handleButtonClick(totalPages)}
            isActive={page == totalPages}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>,
      );
    }
    return items;
  };

  return (
    <>
      <Pagination className={cn("mt-6 md:mt-10", className)}>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href={page > 1 ? handleButtonClick(page - 1) : undefined}
              aria-disabled={page <= 1}
              tabIndex={page <= 1 ? -1 : undefined}
              className={
                page <= 1 ? "pointer-events-none opacity-50" : undefined
              }
            />
          </PaginationItem>
          {renderPageNumbers()}
          <PaginationItem>
            <PaginationNext
              href={page < totalPages ? handleButtonClick(page + 1) : undefined}
              aria-disabled={page >= totalPages}
              tabIndex={page >= totalPages ? -1 : undefined}
              className={
                page >= totalPages
                  ? "pointer-events-none opacity-50"
                  : undefined
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  );
};

export default CoursePagination;
