import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | Acme User Dashboard",
    default: "Acme User Dashboard",
  },
  description: "Online Learning Platform User Dashboard",
};

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
