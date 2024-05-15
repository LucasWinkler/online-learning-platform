"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { CourseForInstructor } from "~/types/course";

import { CopyIcon, MoreHorizontal, PencilIcon } from "lucide-react";
import Link from "next/link";

import { DataTableColumnHeader } from "~/components/data-table/data-table-column-header";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { env } from "~/env";
import { formatCurrency } from "~/lib/utils";

export const courseColumns: ColumnDef<CourseForInstructor>[] = [
  {
    accessorKey: "slug",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Slug" />
    ),
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Price" />
    ),
    cell: ({ row }) => {
      if (!row.getValue("price") || row.getValue("price") === 0) {
        return "Free";
      }

      const price = parseFloat(row.getValue("price"));
      const formatted = formatCurrency(price);

      return formatted;
    },
  },
  {
    accessorKey: "publishedAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Published" />
    ),
    cell: ({ row }) => {
      return (
        <Badge
          variant={row.getValue("publishedAt") ? "success" : "outline"}
          className=""
        >
          {row.getValue("publishedAt") ? "Published" : "Draft"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "_count",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Students" />
    ),
    cell: ({ row }) => {
      const students =
        row.getValue<CourseForInstructor["_count"]>("_count").courseEnrollments;

      return students;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const course = row.original;
      const publicCourseUrl = `${env.NEXT_PUBLIC_VERCEL_URL ?? "http://localhost:3000"}/courses/${course.slug}`;
      const editCourseUrl = `${env.NEXT_PUBLIC_VERCEL_URL ?? "http://localhost:3000"}/manage/courses/${course.slug}`;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link className="cursor-pointer" href={editCourseUrl}>
                <PencilIcon className="mr-2 size-4" />
                Edit Course
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => navigator.clipboard.writeText(publicCourseUrl)}
            >
              <CopyIcon className="mr-2 size-4" />
              Copy URL
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
