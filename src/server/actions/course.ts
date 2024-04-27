// /* eslint-disable @typescript-eslint/no-unsafe-assignment */
// "use server";

// import type { CourseForHome } from "~/types/course";

// import { CourseSelectForHome } from "~/lib/validators";
// import { db } from "~/server/db";

// export type CourseSortCriteria = "popular" | "newest" | "recent";
// export type CourseSortOrder = "asc" | "desc";

// export type CourseListForHome = {
//   courses: CourseForHome[];
//   total: number;
//   page: number;
//   limit: number;
// };

// export type CourseSearchParams = {
//   search?: string | undefined;
//   page?: number;
//   limit?: number;
//   sort?: CourseSortCriteria;
//   order?: CourseSortOrder;
// };

// export default async function GetCoursesForHome({
//   search,
//   page = 1,
//   limit = 10,
//   sort = "popular",
//   order = "desc",
// }: CourseSearchParams) {
//   const skipNumber = (page - 1) * limit;

//   const courses = await db.course.findMany({
//     where: {
//       publishedAt: {
//         not: null,
//       },
//       title: {
//         contains: search,
//         mode: "insensitive",
//       },
//       chapters: {
//         some: {
//           publishedAt: {
//             not: null,
//           },
//           lessons: {
//             some: {
//               publishedAt: {
//                 not: null,
//               },
//             },
//           },
//         },
//       },
//     },
//     select: {
//       ...CourseSelectForHome,
//     },
//     orderBy:
//       sort === "popular"
//         ? {
//             courseEnrollments: {
//               _count: order,
//             },
//           }
//         : sort === "newest"
//           ? {
//               createdAt: order,
//             }
//           : {
//               updatedAt: order,
//             },
//     skip: skipNumber,
//     take: limit,
//   });

//   const totalCourses = await db.course.count({
//     where: {
//       publishedAt: {
//         not: null,
//       },
//       title: {
//         contains: search!,
//         mode: "insensitive",
//       },
//       chapters: {
//         some: {
//           publishedAt: {
//             not: null,
//           },
//           lessons: {
//             some: {
//               publishedAt: {
//                 not: null,
//               },
//             },
//           },
//         },
//       },
//     },
//   });

//   return {
//     courses: courses.map((course) => ({
//       ...course,
//       numberOfLessons: course.lessons.length,
//       lengthInSeconds: course.lessons.reduce(
//         (acc, lesson) => acc + (lesson.length ?? 0),
//         0,
//       ),
//     })),
//     total: totalCourses,
//     page,
//     limit,
//     sort,
//     order,
//   };
// }
