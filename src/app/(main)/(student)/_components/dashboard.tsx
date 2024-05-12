import type { User } from "next-auth";

// Example types
// If logged in then show specific courses with fields for the user
// If not logged in then show featured courses

// Recently accessed courses from the user with progress or some other stats
type StudentCourse = {
  id: string;
  name: string;
  progress: number;
};

// Featured courses for logged out users
// Most likely just the top 5 most popular courses
type FeaturedCourse = {
  id: string;
  name: string;
};

type DashboardCourse = StudentCourse | FeaturedCourse;

type DashboardProps = {
  user?: User;
  courses?: DashboardCourse[];
  progressMetrics?: string[];
};

export const Dashboard = ({}: DashboardProps) => {
  return (
    <>
      <section>user progress</section>
      <section>5 courses</section>
      <section>etc...</section>
    </>
  );
};
