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
    <section className="relative mx-auto grid h-full w-full max-w-5xl items-start gap-6 rounded-xl bg-gray-50 xs:bg-background xs:p-4 md:p-6 lg:grid-cols-[180px_1fr] lg:gap-8 lg:p-10 xl:grid-cols-[250px_1fr]">
      <a
        href="#settings"
        className="sr-only focus:not-sr-only focus:fixed focus:left-0 focus:right-0 focus:top-0 focus:z-[20] focus:w-full focus:bg-primary focus:px-3 focus:py-1 focus:text-center focus:text-primary-foreground"
      >
        Skip to settings
      </a>
      <SettingsNav />
      {children}
    </section>
  );
};

export default SettingsLayout;
