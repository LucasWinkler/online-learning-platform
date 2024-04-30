"use client";

import { useCurrentUser } from "~/hooks/use-current-user";
import { logout } from "~/server/actions/logout";

const ProfileSettingsPage = () => {
  const { user } = useCurrentUser();

  const onClick = async () => {
    await logout();
  };

  return (
    <div>
      ProfileSettingsPage
      <pre className="rounded-md bg-neutral-100 p-2 text-xs">
        {JSON.stringify(user, null, 2)}
      </pre>
      <button onClick={onClick}>Sign out</button>
    </div>
  );
};

export default ProfileSettingsPage;
