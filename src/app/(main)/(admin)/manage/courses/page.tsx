import type { Metadata } from "next";

import { CreateCourseDialog } from "./_components/create-course-dialog";

export const metadata: Metadata = {
  title: "Manage Courses",
};

// Button opens modal on click with title and slug as inputs.
// Warn that user that they can not change their slug again.
const Courses = () => {
  return (
    <div>
      <h1>All your courses</h1>
      <CreateCourseDialog />
    </div>
  );
};

export default Courses;
