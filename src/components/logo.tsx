import { cn } from "~/lib/utils";

export type LogoType = "icon" | "short" | "full";

type LogoProps = {
  className?: string;
  type?: LogoType;
};

export const Logo = ({ className, type = "full" }: LogoProps) => {
  return (
    <h1
      className={cn(
        "text-2xl font-bold italic tracking-tighter md:text-3xl",
        className,
      )}
    >
      {type === "icon" ? "ac" : type === "short" ? "acme" : "acme courses"}
    </h1>
  );
};
