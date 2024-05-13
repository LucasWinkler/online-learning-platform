import type { Metadata } from "next";

import { Button } from "~/components/ui/button";

export const metadata: Metadata = {
  title: "Manage Courses",
};

// Button opens modal on click with title and slug as inputs.
// Warn that user that they can not change their slug again.
const Courses = () => {
  return (
    <section>
      <h1>All your courses</h1>
      <Button>Create Course</Button>
    </section>
  );
};

export default Courses;
