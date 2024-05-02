import { cn } from "~/lib/utils";

type LogoProps = {
  className?: string;
};

export const Logo = ({ className }: LogoProps) => {
  return (
    <h1
      className={cn(
        "text-2xl font-bold italic tracking-tighter md:text-3xl",
        className,
      )}
    >
      acme courses
    </h1>
  );
};
