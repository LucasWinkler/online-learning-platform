import type { Metadata } from "next";

import auth from "~/lib/auth";
import {
  findCoursesByUserId,
  findTop5PopularCourses,
} from "~/server/data-access/course";

import { StudentDashboard } from "./(student)/_components/dashboard";

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "Explore your Dashboard to track your learning progress, access courses, and more.",
};

const fetchCourses = async (userId: string | undefined) => {
  if (userId) {
    return await findCoursesByUserId(userId);
  }

  return await findTop5PopularCourses();
};

const HomePage = async () => {
  const user = (await auth())?.user;
  const courses = await fetchCourses(user?.id);

  return <StudentDashboard courses={courses} />;
};

export default HomePage;
