import { verifyToken } from "~~/server/utils/verify_token";

export default defineEventHandler(async (event) => {
  // get basic auth header and authenticate user token
  const user = verifyToken(event.req.headers.authorization!);

  if (!user)
    return { statusCode: 401, status: "error", message: "Token invalid!" };

  return { status: "ok" };
});
