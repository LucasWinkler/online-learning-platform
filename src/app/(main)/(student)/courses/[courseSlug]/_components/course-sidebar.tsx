import type { CourseInstructor } from "./types";

import { CourseInfoCard } from "./course-info-card";
import { InstructorCard } from "./instructor-card";

type CourseSidebarProps = {
  price: number;
  chaptersCount: number;
  isEnrolled: boolean;
  isFree: boolean;
  instructor: CourseInstructor;
};

export const CourseSidebar = ({
  price,
  chaptersCount,
  isEnrolled,
  isFree,
  instructor,
}: CourseSidebarProps) => (
  <div className="relative lg:h-[calc(100vh-4rem)]">
    <div className="sticky top-20 flex flex-col gap-6">
      <CourseInfoCard
        price={price}
        chaptersCount={chaptersCount}
        isEnrolled={isEnrolled}
        isFree={isFree}
      />
      {instructor && <InstructorCard instructor={instructor} />}
    </div>
  </div>
);
