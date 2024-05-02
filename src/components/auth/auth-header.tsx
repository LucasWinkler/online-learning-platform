import { Link } from "~/components/link";
import { Logo } from "~/components/logo";
import { CardDescription, CardTitle } from "~/components/ui/card";

type AuthHeaderProps = {
  title: string;
  description: string;
  showLogo?: boolean;
};

export const AuthHeader = ({
  title,
  description,
  showLogo = false,
}: AuthHeaderProps) => {
  return (
    <>
      {showLogo && (
        <Link className="mx-auto" href="/">
          <Logo className="text-xl md:text-2xl" />
        </Link>
      )}
      <CardTitle className="text-xl xs:text-2xl">{title}</CardTitle>
      <CardDescription className="text-sm text-muted-foreground">
        {description}
      </CardDescription>
    </>
  );
};
