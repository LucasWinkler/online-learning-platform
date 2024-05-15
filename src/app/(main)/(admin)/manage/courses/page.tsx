import type { CoursesForInstructorResult } from "~/types/course";
import type { Metadata } from "next";

import { Role } from "@prisma/client";

import { DataTable } from "~/components/data-table/data-table";
import { PrimaryHeading } from "~/components/primary-heading";
import auth from "~/lib/auth";
import { findCoursesForInstructor } from "~/server/data-access/course";

import { courseColumns } from "./_components/course-columns";
import { CreateCourseDialog } from "./_components/create-course-dialog";

export const metadata: Metadata = {
  title: "Manage Courses",
};

const fetchCourses = async (
  userId: string,
): Promise<CoursesForInstructorResult> => {
  const courses = await findCoursesForInstructor(userId);

  return courses;
};

const Courses = async () => {
  const session = await auth();
  const user = session?.user;

  if (user?.role !== Role.ADMIN) {
    return null;
  }

  const courses = await fetchCourses(user.id);

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-background p-4 xxs:p-5 xs:p-6 sm:gap-5 lg:gap-6 xl:gap-9">
      <div className="flex flex-col gap-2">
        <div className="flex flex-col items-start justify-between gap-2 xs:flex-row xs:items-center xs:gap-4">
          <PrimaryHeading>Courses</PrimaryHeading>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <DataTable
          action={<CreateCourseDialog />}
          columns={courseColumns}
          data={courses}
          searchColumn="title"
        />
      </div>
    </div>
  );
};

export default Courses;
