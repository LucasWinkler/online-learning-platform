import { cn } from "~/lib/utils";

type PrimaryHeadingProps = {
  children: React.ReactNode;
  className?: string;
};

export const PrimaryHeading = ({
  children,
  className,
}: PrimaryHeadingProps) => {
  return (
    <h2
      className={cn(
        "text-xl font-semibold xxs:text-2xl md:text-3xl",
        className,
      )}
    >
      {children}
    </h2>
  );
};
