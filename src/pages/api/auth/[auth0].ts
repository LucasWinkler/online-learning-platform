import {
  handleAuth,
  handleCallback,
  handleLogin,
  handleLogout,
} from "@auth0/nextjs-auth0";
import { HandlerError } from "@auth0/nextjs-auth0";
import type { NextApiRequest, NextApiResponse } from "next";

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

export default handleAuth({
  async callback(req: NextApiRequest, res: NextApiResponse) {
    try {
      const { redirectUri } = getUrls(req);

      await handleCallback(req, res, {
        redirectUri: redirectUri,
      });
    } catch (error: unknown) {
      if (error instanceof HandlerError) {
        res.status(error.status ?? 500).end(error.message);
      }

      res.status(500).end("Error in /api/auth/[auth0].ts -> callback()");
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
      if (error instanceof HandlerError) {
        res.status(error.status ?? 400).end(error.message);
      }

      res.status(400).end("Error in /api/auth/[auth0].ts -> login()");
    }
  },

  async logout(req: NextApiRequest, res: NextApiResponse) {
    const { returnTo } = getUrls(req);

    await handleLogout(req, res, {
      returnTo: returnTo,
    });
  },
});
