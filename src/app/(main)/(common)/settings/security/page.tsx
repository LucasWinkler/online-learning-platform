import type { Metadata } from "next/types";

import { SettingsWrapper } from "../_components/settings-wrapper";

export const metadata: Metadata = {
  title: "Security",
};

const SecuritySettingsPage = () => {
  return (
    <SettingsWrapper title="Security">
      <p>Will contain change password form, i forgot my password link, 2fa</p>
    </SettingsWrapper>
  );
};

export default SecuritySettingsPage;
