import { getSession } from "@auth0/nextjs-auth0";
import { type UserProfile } from "@auth0/nextjs-auth0/client";
import {
  type GetServerSideProps,
  type InferGetServerSidePropsType,
} from "next";
import Image from "next/image";

import { buttonVariants } from "~/components/ui/button";
import getBase64 from "~/lib/plaiceholder";

export default function Home({
  user,
  blurDataURL,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  if (!user) {
    return (
      <>
        <header className="flex min-h-dvh flex-col items-center justify-center">
          <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
            <h1 className="text-center text-5xl font-extrabold tracking-tight sm:text-[5rem]">
              Online Learning Platform
            </h1>
            {
              // eslint-disable-next-line @next/next/no-html-link-for-pages
              <a
                href="/api/auth/login"
                className={buttonVariants({ variant: "default" })}
              >
                Login
              </a>
            }
          </div>
        </header>
      </>
    );
  }

  return (
    <>
      <header className="flex min-h-dvh flex-col items-center justify-center">
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
                alt={`${user.name} icon`}
                placeholder="blur"
                blurDataURL={blurDataURL}
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

export const getServerSideProps: GetServerSideProps<{
  user?: UserProfile;
  blurDataURL?: string;
}> = async (context) => {
  const { req, res } = context;
  const session = await getSession(req, res);

  try {
    if (session?.user) {
      const user = session.user as UserProfile;
      const blurDataURL = await getBase64(user.picture ?? "");

      return {
        props: { user, blurDataURL },
      };
    }
  } catch (error) {
    console.error("Error fetching user session:", error);
  }

  return {
    props: {},
  };
};
