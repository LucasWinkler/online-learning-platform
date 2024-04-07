import { handleAuth, handleLogin } from "@auth0/nextjs-auth0";
import { HandlerError } from "@auth0/nextjs-auth0";
import type { NextApiRequest, NextApiResponse } from "next";

export default handleAuth({
  async login(req: NextApiRequest, res: NextApiResponse) {
    // req.host could be 'foo.domain.com' or 'bar.domain.com'
    // you can set `BASE_URL` to https://foo.domain.com or https://bar.domain.com
    const redirectUri = `https://${req.headers.host}/api/auth/callback`;
    try {
      await handleLogin(req, res, {
        authorizationParams: {
          redirect_uri: redirectUri,
        },
      });
    } catch (error: unknown) {
      if (error instanceof HandlerError) {
        res.status(error.status ?? 400).end(error.message);
      }

      res.status(400).end("Error 400 in /api/auth/[auth0].ts -> handleLogin()");
    }
  },
});
