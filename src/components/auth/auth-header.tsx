import { CardDescription, CardTitle } from "~/components/ui/card";

import { Link } from "../link";
import { Logo } from "../logo";

type AuthHeaderProps = {
  title: string;
  description: string;
};

export const AuthHeader = ({ title, description }: AuthHeaderProps) => {
  return (
    <>
      <Link className="mx-auto" href="/">
        <Logo />
      </Link>
      <CardTitle className="text-xl xs:text-2xl">{title}</CardTitle>
      <CardDescription className="text-sm text-muted-foreground">
        {description}
      </CardDescription>
    </>
  );
};
