import { db } from "../src/server/db";

async function main() {
  // await db.post.deleteMany();
  //
  // for (const post of posts) {
  //   await db.post.create({
  //     data: {
  //       name: post.name,
  //       description: post.description,
  //     },
  //   });
  // }
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
