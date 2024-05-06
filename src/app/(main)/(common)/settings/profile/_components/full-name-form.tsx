"use client";

import { useSession } from "next-auth/react";

import { Input } from "~/components/ui/input";

export const FullNameForm = () => {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <form>
      <Input
        disabled
        className="bg-background"
        defaultValue={user?.name ?? ""}
        placeholder="John Doe"
      />
    </form>
  );
};
