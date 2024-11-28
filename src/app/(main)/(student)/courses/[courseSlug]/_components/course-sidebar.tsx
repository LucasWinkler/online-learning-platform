import type { CourseInstructor } from "./types";

import { CourseInfoCard } from "./course-info-card";
import { InstructorCard } from "./instructor-card";

type CourseSidebarProps = {
  courseId: string;
  price: number;
  chaptersCount: number;
  isEnrolled: boolean;
  isFree: boolean;
  instructor: CourseInstructor;
  courseSlug: string;
};

export const CourseSidebar = ({
  courseId,
  price,
  chaptersCount,
  isEnrolled,
  isFree,
  instructor,
  courseSlug,
}: CourseSidebarProps) => (
  <div className="relative lg:h-[calc(100vh-4rem)]">
    <div className="sticky top-20 flex flex-col gap-6">
      <CourseInfoCard
        courseId={courseId}
        price={price}
        chaptersCount={chaptersCount}
        isEnrolled={isEnrolled}
        isFree={isFree}
        courseSlug={courseSlug}
      />
      {instructor && <InstructorCard instructor={instructor} />}
    </div>
  </div>
);
