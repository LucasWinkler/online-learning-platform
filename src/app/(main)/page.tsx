import type { Metadata } from "next";

import auth from "~/lib/auth";

import { Dashboard } from "./(student)/_components/dashboard";

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "Explore your Dashboard to track your learning progress, access courses, and more.",
};

// if userId fetch courses for that user
// if not userId fetch top 5 popular courses
const fetchCourses = (userId: string | undefined) => {
  if (userId) {
    // fetch courses for that user
  } else {
    // fetch top 5 popular courses
  }

  return [];
};

// Fetch all data here
// Pass data to
const HomePage = async () => {
  const session = await auth();
  const user = session?.user;
  const courses = fetchCourses(user?.id);

  return (
    <div className="">
      <Dashboard courses={courses} user={user} />
    </div>
  );
};

export default HomePage;
