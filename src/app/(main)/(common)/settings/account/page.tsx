import type { Metadata } from "next/types";

import { SettingsWrapper } from "../_components/settings-wrapper";

export const metadata: Metadata = {
  title: "Account",
};

const AccountSettingsPage = () => {
  return (
    <SettingsWrapper title="Account">
      <p>
        Will contain changing email, linking to other providers, and deleting
        account.
      </p>
    </SettingsWrapper>
  );
};

export default AccountSettingsPage;
