"use client";

import { useRouter } from "next/navigation";

type LoginButtonProps = {
  children: React.ReactNode;
  type?: "modal" | "redirect";
  asChild?: boolean;
};

export const LoginButton = ({
  children,
  type = "redirect",
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  asChild,
}: LoginButtonProps) => {
  const router = useRouter();

  const onClick = () => {
    router.push("/auth/login");
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

export default LoginButton;
