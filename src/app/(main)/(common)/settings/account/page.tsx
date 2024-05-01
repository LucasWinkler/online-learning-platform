import type { Metadata } from "next/types";

import { SettingsWrapper } from "../_components/settings-wrapper";

export const metadata: Metadata = {
  title: "Account",
};

const AccountSettingsPage = () => {
  return <SettingsWrapper title="Account"></SettingsWrapper>;
};

export default AccountSettingsPage;
