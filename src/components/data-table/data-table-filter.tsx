"use client";

import type { Table } from "@tanstack/react-table";

import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";

import { Button } from "../ui/button";

interface DataTableFilterProps<TData> {
  table: Table<TData>;
  columnName: string;
  className?: string;
}

export function DataTableFilter<TData>({
  table,
  columnName,
  className,
}: DataTableFilterProps<TData>) {
  if (!table.getColumn(columnName)) {
    return null;
  }

  return (
    <>
      <Input
        id={`filter-${columnName}`}
        name={`filter-${columnName}`}
        autoComplete="off"
        placeholder={`Search ${columnName}...`}
        value={(table.getColumn(columnName)?.getFilterValue() as string) ?? ""}
        onChange={(event) =>
          table.getColumn(columnName)?.setFilterValue(event.target.value)
        }
        className={cn("h-8 max-w-sm", className)}
      />
      <Button
        className="hidden xs:inline-flex"
        variant="outline"
        size="sm"
        onClick={() => table.getColumn(columnName)?.setFilterValue("")}
      >
        Clear
      </Button>
    </>
  );
}
