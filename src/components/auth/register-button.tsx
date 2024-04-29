"use client";

import { useRouter } from "next/navigation";

type RegisterButtonProps = {
  children: React.ReactNode;
  type?: "modal" | "redirect";
  asChild?: boolean;
};

export const RegisterButton = ({
  children,
  type = "redirect",
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  asChild,
}: RegisterButtonProps) => {
  const router = useRouter();

  const onClick = () => {
    router.push("/auth/register");
  };

  if (type === "modal") {
    return <span>TODO: Implement modal</span>;
  }

  return (
    <span onClick={onClick} className="cursor-pointer">
      {children}
    </span>
  );
};
