import type { Metadata } from "next/types";

import { SettingsWrapper } from "../_components/settings-wrapper";

export const metadata: Metadata = {
  title: "Security",
};

const SecuritySettingsPage = () => {
  return <SettingsWrapper title="Security"></SettingsWrapper>;
};

export default SecuritySettingsPage;
