import { ContentType, Role } from "@prisma/client";
import { db } from "../src/server/db";
import { env } from "~/env";

async function main() {
  console.log("Seed: Starting");
  if (env.NODE_ENV === "production") {
    throw new Error("Error: Can not seed the production database");
  }

  console.log("Seed: Attempting to delete existing data");

  await db.user.deleteMany();
  await db.discount.deleteMany();
  await db.course.deleteMany();
  await db.chapter.deleteMany();
  await db.lesson.deleteMany();
  await db.courseEnrollment.deleteMany();

  console.log("Seed: Reseting AUTO_INCREMENT to 1 for each table");

  await db.$executeRaw`ALTER SEQUENCE "User_id_seq" RESTART WITH 1;`;
  await db.$executeRaw`ALTER SEQUENCE "Discount_id_seq" RESTART WITH 1;`;
  await db.$executeRaw`ALTER SEQUENCE "Course_id_seq" RESTART WITH 1;`;
  await db.$executeRaw`ALTER SEQUENCE "Chapter_id_seq" RESTART WITH 1;`;
  await db.$executeRaw`ALTER SEQUENCE "Lesson_id_seq" RESTART WITH 1;`;
  await db.$executeRaw`ALTER SEQUENCE "CourseEnrollment_id_seq" RESTART WITH 1;`;

  console.log("Seed: Deleted existing data");
  console.log("Seed: Creating tables");

  const adminUser = await db.user.create({
    data: {
      id: 1,
      name: "Lucas Winkler",
      email: "lucaswinkler@gmail.com",
      role: Role.ADMIN,
    },
  });

  console.log("Seed: Created admin user", adminUser.email);

  const discount1 = await db.discount.create({
    data: {
      name: "15% Off",
      percentage: 15,
      instructorId: 1,
    },
  });

  const discount2 = await db.discount.create({
    data: {
      name: "20% Off",
      percentage: 20,
      instructorId: 1,
    },
  });

  console.log("Seed: Created discounts", discount1.name, discount2.name);

  const course1 = await db.course.create({
    data: {
      title: "Course 1",
      slug: "course-1",
      description: "Description for Course 1",
      price: 100,
      thumbnail: "https://fakeimg.pl/300x170?text=Thumbnail&font=bebas",
      instructorId: adminUser.id,
      discountId: discount1.id,
    },
  });

  const course2 = await db.course.create({
    data: {
      title: "Course 2",
      slug: "course-2",
      description: "Description for Course 2",
      price: 150,
      thumbnail: "https://fakeimg.pl/300x170?text=Thumbnail&font=bebas",
      instructorId: adminUser.id,
    },
  });

  for (let i = 1; i <= 2; i++) {
    const chapter1 = await db.chapter.create({
      data: {
        title: `Chapter ${i} for Course 1`,
        slug: `chapter-${i}-course-1`,
        courseId: course1.id,
        order: i,
      },
    });

    const chapter2 = await db.chapter.create({
      data: {
        title: `Chapter ${i} for Course 2`,
        slug: `chapter-${i}-course-2`,
        courseId: course2.id,
        order: i,
      },
    });

    console.log(
      `Seed: Created chapters for Course 1 - ${chapter1.title}, Course 2 - ${chapter2.title}`,
    );

    for (let j = 1; j <= 2; j++) {
      const lesson1 = await db.lesson.create({
        data: {
          title: `Lesson ${j} for Chapter ${i} of Course 1`,
          slug: `lesson-${j}-chapter-${i}-course-1`,
          description: `Description for Lesson ${j} of Chapter ${i} for Course 1`,
          contentType: ContentType.TEXT,
          textContent: "This is a markdown text content.",
          length: 600, // 10 minutes for example
          order: j,
          courseId: course1.id,
          chapterId: chapter1.id,
        },
      });

      const lesson2 = await db.lesson.create({
        data: {
          title: `Lesson ${j} for Chapter ${i} of Course 2`,
          slug: `lesson-${j}-chapter-${i}-course-2`,
          description: `Description for Lesson ${j} of Chapter ${i} for Course 2`,
          contentType: ContentType.VIDEO,
          videoContent: "https://www.example.com/video",
          length: 900, // 15 minutes for example
          order: j,
          courseId: course2.id,
          chapterId: chapter2.id,
        },
      });

      console.log(
        `Seed: Created lessons for Chapter ${i} of Course 1 - ${lesson1.title}, Course 2 - ${lesson2.title}`,
      );
    }
  }
}

main()
  .then(async () => {
    await db.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });
