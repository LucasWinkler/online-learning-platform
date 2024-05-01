type SettingsWrapperProps = {
  title: string;
  children?: React.ReactNode;
};

export const SettingsWrapper = ({ title, children }: SettingsWrapperProps) => {
  return (
    <div className="space-y-4 md:space-y-8">
      <h2 className="text-3xl font-semibold">{title}</h2>
      <div className="space-y-6">{children}</div>
    </div>
  );
};
