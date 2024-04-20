import type { AfterCallbackPageRoute } from "@auth0/nextjs-auth0";
import type { NextApiRequest, NextApiResponse } from "next";

import {
  handleAuth,
  handleCallback,
  handleLogin,
  handleLogout,
  HandlerError,
} from "@auth0/nextjs-auth0";

import { createUserFromAuth0 } from "~/server/mutations/user";

/**
 * Grabs the correct redirectUri and returnTo url based on
 * project environment.
 * This is to solve auth0 not working in vercel preview
 * deployments due to dynamically generated deploy urls.
 * @param req NextApiRequest
 * @returns redirectUri, returnTo
 */
function getUrls(req: NextApiRequest) {
  const host = req.headers.host;
  const protocol = process.env.VERCEL_URL ? "https" : "http";
  const redirectUri = `${protocol}://${host}/api/auth/callback`;
  const returnTo = `${protocol}://${host}`;

  return {
    redirectUri,
    returnTo,
  };
}

const afterCallback: AfterCallbackPageRoute = async (req, res, session) => {
  try {
    const { email, name, picture, email_verified } = session.user;

    await createUserFromAuth0(
      email as string,
      name as string,
      picture as string,
      email_verified as boolean,
    );
  } catch (error) {
    console.error("Error occurred during user creation:", error);
    throw error;
  }

  return session;
};

export default handleAuth({
  async callback(req: NextApiRequest, res: NextApiResponse) {
    try {
      const { redirectUri } = getUrls(req);

      await handleCallback(req, res, {
        redirectUri: redirectUri,
        afterCallback,
      });
    } catch (error: unknown) {
      console.error("Error in handleAuth callback:", error);
      if (error instanceof HandlerError) {
        res.status(error.status ?? 500).end(error.message);
      }

      res.status(500).end("An error occurred during authentication callback");
    }
  },

  async login(req: NextApiRequest, res: NextApiResponse) {
    try {
      const { redirectUri, returnTo } = getUrls(req);

      await handleLogin(req, res, {
        authorizationParams: {
          redirect_uri: redirectUri,
        },

        returnTo: returnTo,
      });
    } catch (error: unknown) {
      console.error("Error in handleAuth login:", error);

      if (error instanceof HandlerError) {
        if (error.status) {
          res.status(error.status).end(error.message);
        }
      }

      res.status(400).end("An error occurred during login");
    }
  },

  async logout(req: NextApiRequest, res: NextApiResponse) {
    const { returnTo } = getUrls(req);
    try {
      await handleLogout(req, res, {
        returnTo: returnTo,
      });
    } catch (error: unknown) {
      console.error("Error in handleAuth logout:", error);
      res.status(500).end("An error occurred during logout");
    }
  },
});
