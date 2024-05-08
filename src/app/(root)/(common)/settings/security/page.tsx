import type { Metadata } from "next/types";

import { SettingsWrapper } from "../_components/settings-wrapper";
import { ChangePasswordCard } from "./_components/change-password-card";
import Toggle2FACard from "./_components/toggle-2fa-card";

export const metadata: Metadata = {
  title: "Security",
};

// TODO: Conditionally render 2FA form, password form, etc. based on user's account type (oauth or credentials)
const SecuritySettingsPage = () => {
  return (
    <SettingsWrapper title="Security">
      <ChangePasswordCard />
      <Toggle2FACard />
    </SettingsWrapper>
  );
};

export default SecuritySettingsPage;
