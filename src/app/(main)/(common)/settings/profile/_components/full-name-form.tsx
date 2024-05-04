import type { User } from "next-auth";

import { Input } from "~/components/ui/input";

type FullNameFormProps = {
  user?: User;
};

export const FullNameForm = ({ user }: FullNameFormProps) => {
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
