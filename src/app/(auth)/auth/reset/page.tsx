import type { Metadata } from "next";

import { ResetForm } from "~/components/auth/reset-form";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Reset your accounts password",
};

const ResetPasswordPage = () => {
  return <ResetForm />;
};

export default ResetPasswordPage;
