import { Role } from "@prisma/client";

import { env } from "~/env";
import getBase64 from "~/lib/plaiceholder";
import { db } from "~/server/db";

async function main() {
  if (env.NODE_ENV === "production") {
    throw new Error("Error: Can not seed the production database");
  }

  console.log("Seed: Starting up...");

  const placeholderImageUrl =
    "https://fakeimg.pl/1200x703?text=Thumbnail&font=bebas";

  await db.user.deleteMany();
  await db.discount.deleteMany();
  await db.course.deleteMany();
  await db.chapter.deleteMany();
  await db.lesson.deleteMany();
  await db.courseEnrollment.deleteMany();

  await db.$executeRaw`ALTER SEQUENCE "User_id_seq" RESTART WITH 1;`;
  await db.$executeRaw`ALTER SEQUENCE "Discount_id_seq" RESTART WITH 1;`;
  await db.$executeRaw`ALTER SEQUENCE "Course_id_seq" RESTART WITH 1;`;
  await db.$executeRaw`ALTER SEQUENCE "Chapter_id_seq" RESTART WITH 1;`;
  await db.$executeRaw`ALTER SEQUENCE "Lesson_id_seq" RESTART WITH 1;`;

  const users = [];
  const adminUser = await db.user.create({
    data: {
      name: "Lucas Winkler",
      email: "lucaswinkler@gmail.com",
      role: Role.ADMIN,
    },
  });
  users.push(adminUser);

  // Create additional fake users
  for (let i = 1; i <= 4; i++) {
    const user = await db.user.create({
      data: {
        name: `Fake User ${i}`,
        email: `fakeuser${i}@gmail.com`,
        role: Role.USER,
      },
    });
    users.push(user);
  }

  const placeholderBlurDataImageUrl = await getBase64(placeholderImageUrl);

  for (let i = 1; i <= 12; i++) {
    const discount = await db.discount.create({
      data: {
        name: `${i * 5}% Off`,
        percentage: i * 5,
        instructorId: adminUser.id,
      },
    });

    const course = await db.course.create({
      data: {
        title: `Course Title ${i}`,
        slug: `course-title-${i}`,
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ",
        price: Math.floor(Math.random() * 100) + 50,
        imageUrl: placeholderImageUrl,
        imageBlurDataUrl: placeholderBlurDataImageUrl,
        instructorId: adminUser.id,
        isPublished: true,
        discountId: discount.id,
      },
    });

    const randomEnrollments = Math.floor(Math.random() * users.length);
    const shuffledUsers = users.sort(() => 0.5 - Math.random());
    for (let e = 0; e < randomEnrollments; e++) {
      const user = shuffledUsers[e];
      if (user) {
        await db.courseEnrollment.create({
          data: {
            courseId: course.id,
            studentId: user.id,
          },
        });
      }
    }

    const chapterCount = Math.floor(Math.random() * 5) + 1; // Ensure at least 1 chapter, up to 5
    for (let j = 1; j <= chapterCount; j++) {
      const chapter = await db.chapter.create({
        data: {
          title: `Chapter ${j} for Course ${i}`,
          slug: `chapter-${j}-course-${i}`,
          courseId: course.id,
          order: j,
          isPublished: true,
        },
      });

      const lessonCount = Math.floor(Math.random() * 5) + 1; // Ensure at least 1 lesson, up to 5
      for (let k = 1; k <= lessonCount; k++) {
        await db.lesson.create({
          data: {
            title: `Lesson ${k} for Chapter ${j} of Course ${i}`,
            slug: `lesson-${k}-chapter-${j}-course-${i}`,
            description: `Description for Lesson ${k} of Chapter ${j} for Course ${i}`,
            videoUrl: "https://www.example.com/video",
            length: Math.floor(Math.random() * 900) + 240,
            order: k,
            courseId: course.id,
            chapterId: chapter.id,
            isPublished: true,
          },
        });
      }
    }
  }

  console.log("Seed: Finished.");
}

main()
  .then(async () => {
    console.log("Seed: Disconnecting database connection...");

    await db.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });
