import type { Metadata } from "next/types";

import { SettingsNav } from "./_components/settings-nav";

export const metadata: Metadata = {
  title: {
    default: "Settings",
    template: "%s Settings | Acme",
  },
};

type SettingsLayoutProps = {
  children: React.ReactNode;
};

// TODO: Add page for notifications and payments
const SettingsLayout = ({ children }: SettingsLayoutProps) => {
  return (
    <section className="mx-auto grid h-full w-full max-w-5xl items-start gap-6 rounded-xl bg-gray-50 p-4 xs:bg-background md:p-6 lg:grid-cols-[180px_1fr] lg:gap-8 lg:p-10 xl:grid-cols-[250px_1fr]">
      <SettingsNav />
      {children}
    </section>
  );
};

export default SettingsLayout;
