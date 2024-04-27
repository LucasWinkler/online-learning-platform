import type { Metadata } from "next";

import { RegisterForm } from "~/components/auth/register-form";

export const metadata: Metadata = {
  title: "Register",
  description: "Create an account",
};

const RegisterPage = () => {
  return (
    <>
      <RegisterForm />
    </>
  );
};

export default RegisterPage;
