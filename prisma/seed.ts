import { Role } from "@prisma/client";

import { env } from "~/env";
import getBase64 from "~/lib/plaiceholder";
import { db } from "~/server/db";

async function main() {
  if (env.NODE_ENV === "production") {
    throw new Error("Error: Can not seed the production database");
  }

  console.log("Seed: Starting up...");

  const placeholderImageUrl1 = "https://i.imgur.com/cONzcMV.png";
  const placeholderImageUrl2 = "https://i.imgur.com/SHhokT4.png";

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

  const adminUser = await db.user.create({
    data: {
      id: 1,
      name: "Lucas Winkler",
      email: "lucaswinkler@gmail.com",
      role: Role.ADMIN,
    },
  });

  const discount1 = await db.discount.create({
    data: {
      name: "75% Off",
      percentage: 75,
      instructorId: 1,
    },
  });

  const discount2 = await db.discount.create({
    data: {
      name: "40% off Launch Discount",
      percentage: 40,
      instructorId: 1,
    },
  });

  const placeholderBlurDataImageUrl1 = await getBase64(placeholderImageUrl1);
  const placeholderBlurDataImageUrl2 = await getBase64(placeholderImageUrl2);

  const course1 = await db.course.create({
    data: {
      title: "JavaScript Fundamentals",
      slug: "javascript-fundamentals",
      description:
        "Master the fundamentals of JavaScript, covering variables, functions, conditionals, and loops. Build a solid foundation for web development and start creating interactive and dynamic web applications.",
      price: 99.99,
      imageUrl: placeholderImageUrl1,
      imageBlurDataUrl: placeholderBlurDataImageUrl1,
      instructorId: adminUser.id,
      isPublished: true,
      discountId: discount1.id,
    },
  });

  const course2 = await db.course.create({
    data: {
      title: "Advanced JavaScript",
      slug: "advanced-javascript",
      description:
        "Deepen your understanding of JavaScript with advanced topics like closures, prototypes, and asynchronous programming. Explore modern frameworks and tools to develop sophisticated web applications and enhance your JavaScript expertise for professional-level projects.",
      price: 129.99,
      imageUrl: placeholderImageUrl2,
      imageBlurDataUrl: placeholderBlurDataImageUrl2,
      instructorId: adminUser.id,
      isPublished: true,
      discountId: discount2.id,
    },
  });

  for (let i = 1; i <= 2; i++) {
    const chapter1 = await db.chapter.create({
      data: {
        title: `Chapter ${i} for Course 1`,
        slug: `chapter-${i}-course-1`,
        courseId: course1.id,
        order: i,
        isPublished: true,
      },
    });

    const chapter2 = await db.chapter.create({
      data: {
        title: `Chapter ${i} for Course 2`,
        slug: `chapter-${i}-course-2`,
        courseId: course2.id,
        order: i,
        isPublished: true,
      },
    });

    for (let j = 1; j <= 6; j++) {
      await db.lesson.create({
        data: {
          title: `Lesson ${j} for Chapter ${i} of Course 1`,
          slug: `lesson-${j}-chapter-${i}-course-1`,
          description: `Description for Lesson ${j} of Chapter ${i} for Course 1`,
          videoUrl: "https://www.example.com/video",
          length: Math.floor(Math.random() * 900) + 240,
          order: j,
          courseId: course1.id,
          chapterId: chapter1.id,
          isPublished: true,
        },
      });
    }

    for (let j = 1; j <= 8; j++) {
      await db.lesson.create({
        data: {
          title: `Lesson ${j} for Chapter ${i} of Course 2`,
          slug: `lesson-${j}-chapter-${i}-course-2`,
          description: `Description for Lesson ${j} of Chapter ${i} for Course 2`,
          videoUrl: "https://www.example.com/video",
          length: Math.floor(Math.random() * 900) + 240,
          order: j,
          courseId: course2.id,
          chapterId: chapter2.id,
          isPublished: true,
        },
      });
    }
  }

  await db.courseEnrollment.create({
    data: {
      studentId: adminUser.id,
      courseId: course1.id,
    },
  });

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
