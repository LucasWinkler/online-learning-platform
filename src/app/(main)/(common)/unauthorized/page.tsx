import type { Metadata } from "next";

import { UnauthorizedCard } from "./_components/unauthorized-card";

export const metadata: Metadata = {
  title: "Unauthorized",
  description: "You are not authorized to access this page",
};
const UnauthorizedPage = () => {
  return <UnauthorizedCard />;
};

export default UnauthorizedPage;
