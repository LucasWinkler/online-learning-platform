"use server";

import type { z } from "zod";

import { ToggleTwoFactorAuthenticationSchema } from "~/schemas/auth";
import { toggleTwoFactor } from "~/server/use-cases/2fa";

export const toggleTwoFactorAuthentication = async (
  values: z.infer<typeof ToggleTwoFactorAuthenticationSchema>,
) => {
  const validatedFields = ToggleTwoFactorAuthenticationSchema.safeParse(values);
  if (!validatedFields.success) {
    return {
      showCodeInput: false,
      error: "An unknown error occurred while changing your 2FA settings.",
    };
  }

  const { code } = validatedFields.data;

  try {
    const result = await toggleTwoFactor(code);


    return {
      showCodeInput: result.showCodeInput,
      isTwoFactorEnabled: result.isTwoFactorEnabled,
      error: result.error,
      message: result.message,
      success: result.success,
    };
  } catch (error) {
    return {
      showCodeInput: false,
      error: "An unknown error occurred while changing your 2FA settings.",
    };
  }
};
