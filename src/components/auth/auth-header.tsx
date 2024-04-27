import { CardDescription, CardTitle } from "~/components/ui/card";

type AuthHeaderProps = {
  title: string;
  description: string;
};

export const AuthHeader = ({ title, description }: AuthHeaderProps) => {
  return (
    <>
      <CardTitle className="text-xl xs:text-2xl">{title}</CardTitle>
      <CardDescription className="text-sm text-muted-foreground">
        {description}
      </CardDescription>
    </>
  );
};
