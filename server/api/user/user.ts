import DBConnector from "~~/server/utils/DBConnector";
import { verifyToken } from "~~/server/utils/jwt";

export default defineEventHandler(async (event) => {
  // get basic auth header and authenticate user token
  const decoded = verifyToken(event.req.headers.authorization!);

  if (!decoded)
    return { statusCode: 401, status: "error", message: "Token invalid!" };

  const db = await DBConnector.get_instance();
  const user = await db.get_user(decoded.id_user);

  return { user };
});
