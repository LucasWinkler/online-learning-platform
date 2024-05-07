import type { Metadata } from "next/types";

import { SettingsWrapper } from "../_components/settings-wrapper";
import { ChangeEmailCard } from "./_components/change-email-card";
import { DeleteAccountCard } from "./_components/delete-account-card";

export const metadata: Metadata = {
  title: "Account",
};

const AccountSettingsPage = () => {
  return (
    <SettingsWrapper title="Account">
      <ChangeEmailCard />
      <DeleteAccountCard />
    </SettingsWrapper>
  );
};

export default AccountSettingsPage;
