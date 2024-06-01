type CourseWrapperProps = {
  children: React.ReactNode;
};

export const CourseWrapper = ({ children }: CourseWrapperProps) => {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-background p-4 xxs:p-5 xs:p-6 sm:gap-5 lg:gap-6 xl:gap-9">
      {children}
    </div>
  );
};
