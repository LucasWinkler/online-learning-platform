import { PrimaryHeading } from "~/components/primary-heading";

type SettingsWrapperProps = {
  title: string;
  children?: React.ReactNode;
};

export const SettingsWrapper = ({ title, children }: SettingsWrapperProps) => {
  const settingsTitle = `${title} Settings`;

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-background p-4 xxs:p-5 xs:p-6 sm:gap-5 lg:gap-6">
      <PrimaryHeading>{settingsTitle}</PrimaryHeading>
      <div id="settings" className="flex flex-col gap-6">
        {children}
      </div>
    </div>
  );
};
