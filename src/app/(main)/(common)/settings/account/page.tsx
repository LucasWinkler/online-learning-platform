import type { Metadata } from "next/types";

import { currentUser } from "~/lib/auth";

import { SettingsWrapper } from "../_components/settings-wrapper";
import { DeleteAccountCard } from "./_components/delete-account-card";
import { EmailCard } from "./_components/email-card";
import { LinkedAccountsCard } from "./_components/linked-accounts-card";

export const metadata: Metadata = {
  title: "Account",
};

const AccountSettingsPage = async () => {
  const user = await currentUser();

  return (
    <SettingsWrapper title="Account">
      <EmailCard user={user} />
      <LinkedAccountsCard />
      <DeleteAccountCard />
    </SettingsWrapper>
  );
};

export default AccountSettingsPage;
