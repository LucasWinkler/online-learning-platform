import { AuthWrapper } from "~/components/auth/auth-wrapper";

export const LoginForm = () => {
  return (
    <AuthWrapper
      title="Welcome back"
      description="Enter your details to start learning today!"
      altActionText="New here? Create an account"
      altActionHref="/auth/register"
      showSocialList
    >
      Login Form
    </AuthWrapper>
  );
};
