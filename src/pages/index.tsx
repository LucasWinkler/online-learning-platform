import Head from "next/head";
import { buttonVariants } from "~/components/ui/button";
import { useUser } from "@auth0/nextjs-auth0/client";
import Image from "next/image";

export default function Home() {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  if (user) {
    return (
      <>
        <Head>
          <title>Online Learning Platform</title>
          <meta name="description" content="Online Learning Platform" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <header className="flex min-h-screen flex-col items-center justify-center">
          <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
            <h1 className="text-center text-5xl font-extrabold tracking-tight sm:text-[5rem]">
              Online Learning Platform
            </h1>
            <div>
              {user.picture && (
                <Image
                  width="96"
                  height="96"
                  src={user.picture}
                  alt={user.name ?? "User picture"}
                />
              )}
              <h2>Welcome {user.name}!</h2>
              <p>{user.email}</p>
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
              <a
                href="/api/auth/logout"
                className={buttonVariants({ variant: "destructive" })}
              >
                Logout
              </a>
            </div>
          </div>
        </header>
      </>
    );
  }

  return (
    <>
      {
        // eslint-disable-next-line @next/next/no-html-link-for-pages
        <a
          href="/api/auth/login"
          className={buttonVariants({ variant: "default" })}
        >
          Login
        </a>
      }
    </>
  );
}

// Example getServerSideProps:
// The page will infer: export default function Home({ posts, }: InferGetServerSidePropsType<typeof getServerSideProps>)
// export const getServerSideProps = (async () => {
//   const posts = await db.post.findMany();

//   console.log("Fetching posts with Prisma & Neon:", posts);

//   return {
//     props: { posts },
//   };
// }) satisfies GetServerSideProps<{ posts: Post[] }>;
