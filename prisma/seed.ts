import { db } from "../src/server/db";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const posts = [
  {
    name: "Learning how to code",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Senectus et netus et malesuada fames ac turpis. Lacus viverra vitae congue eu consequat ac felis donec et.",
  },
  {
    name: "Create a database",
    description:
      "Volutpat diam ut venenatis tellus in. Suspendisse interdum consectetur libero id faucibus nisl tincidunt eget nullam. Nisi porta lorem mollis aliquam ut porttitor leo a. Bibendum ut tristique et egestas quis ipsum.",
  },
  {
    name: "Testing 123",
    description:
      "Ut morbi tincidunt augue interdum velit euismod in. Volutpat consequat mauris nunc congue nisi. In massa tempor nec feugiat nisl pretium fusce. Nulla facilisi etiam dignissim diam quis enim lobortis scelerisque fermentum.",
  },
];

async function main() {
  console.log("Seeding: No seeding at this moment...");

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
