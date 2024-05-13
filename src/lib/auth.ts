import { cache } from "react";

import { auth } from "~/server/auth";

/**
 * Deduplicate the auth() request from the same route
 */
export default cache(auth);
