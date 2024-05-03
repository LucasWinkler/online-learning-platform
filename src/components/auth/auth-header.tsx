import { Link } from "~/components/link";
import { Logo } from "~/components/logo";
import { CardDescription, CardTitle } from "~/components/ui/card";

type AuthHeaderProps = {
  title: string;
  description: string;
  showLogo?: boolean;
  logoType?: "icon" | "short" | "full";
};

export const AuthHeader = ({
  title,
  description,
  showLogo = false,
  logoType,
}: AuthHeaderProps) => {
  return (
    <>
      {showLogo && (
        <Link className="mx-auto" href="/">
          <Logo type={logoType} className="text-2xl md:text-2xl" />
        </Link>
      )}
      <CardTitle className="text-2xl xxs:text-3xl xs:text-2xl">
        {title}
      </CardTitle>
      <CardDescription className="text-base text-muted-foreground xxs:text-lg xs:text-sm">
        {description}
      </CardDescription>
    </>
  );
};
