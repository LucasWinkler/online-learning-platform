type SettingsWrapperProps = {
  title: string;
  children?: React.ReactNode;
};

export const SettingsWrapper = ({ title, children }: SettingsWrapperProps) => {
  const settingsTitle = `${title} Settings`;

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-background p-6 sm:gap-5 lg:gap-6">
      <h2 className="text-xl font-semibold xxs:text-2xl md:text-3xl">
        {settingsTitle}
      </h2>
      <div className="flex flex-col gap-6">{children}</div>
    </div>
  );
};
