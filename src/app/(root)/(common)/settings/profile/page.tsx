import type { Metadata } from "next/types";

import { SettingsWrapper } from "../_components/settings-wrapper";
import { AvatarCard } from "./_components/avatar-card";
import { ChangeNameCard } from "./_components/change-name-card";

export const metadata: Metadata = {
  title: "Profile",
};

const ProfileSettingsPage = () => {
  return (
    <SettingsWrapper title="Profile">
      <AvatarCard />
      <ChangeNameCard />
    </SettingsWrapper>
  );
};

export default ProfileSettingsPage;
