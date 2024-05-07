import type { Metadata } from "next/types";

import { SettingsWrapper } from "../_components/settings-wrapper";
import { AvatarCard } from "./_components/avatar-card";
import { FullNameCard } from "./_components/full-name-card";

export const metadata: Metadata = {
  title: "Profile",
};

const ProfileSettingsPage = () => {
  return (
    <SettingsWrapper title="Profile">
      <AvatarCard />
      <FullNameCard />
    </SettingsWrapper>
  );
};

export default ProfileSettingsPage;
