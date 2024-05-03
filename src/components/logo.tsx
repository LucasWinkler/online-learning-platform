import { cn } from "~/lib/utils";

type LogoProps = {
  className?: string;
  type?: "icon" | "short" | "full";
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
