import type { Metadata } from "next";

import { formatCurrency } from "~/lib/utils";
import { db } from "~/server/db";

export const metadata: Metadata = {
  title: "Manage Courses",
};

export const dynamicParams = true;

export const generateStaticParams = async () => {
  const courses = await db.course.findMany();

  return courses.map((course) => ({
    slug: course.slug,
  }));
};

const fetchCourse = async (slug: string) => {
  const course = await db.course.findUnique({
    where: { slug },
  });

  return course;
};

const CourseDetails = async ({ params }: { params: { slug: string } }) => {
  const { slug } = params;
  const course = await fetchCourse(slug);

  if (!course) {
    return <span>Course not found</span>;
  }

  return (
    <section>
      <h1>Course details</h1>
      <p>Title: {course.title}</p>
      <p>Description: {course.description}</p>
      <p>Slug: {course.slug}</p>
      <p>Created at: {course.createdAt.toLocaleDateString()}</p>
      <p>Updated at: {course.updatedAt.toLocaleDateString()}</p>
      <p>Published: {course.publishedAt ? "Yes" : "No"}</p>
      <p>Published at: {course.publishedAt?.toLocaleDateString()}</p>
      <p>Price: {course.price ? formatCurrency(course.price) : "Free"}</p>
    </section>
  );
};

export default CourseDetails;
