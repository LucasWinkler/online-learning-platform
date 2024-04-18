import { type NextApiRequest, type NextApiResponse } from "next/types";

import { type HttpMethod } from "~/types/api";

export const handleInvalidMethod = (
  req: NextApiRequest,
  res: NextApiResponse,
  method: HttpMethod,
) => {
  if (req.method !== method) {
    return res.status(405).json({
      message: `Method ${req.method} Not Allowed on path ${req.url}`,
    });
  }
};
