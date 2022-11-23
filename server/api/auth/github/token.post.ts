import jwt from "jsonwebtoken";
import DBConnector from "~~/server/utils/DBConnector";

export default defineEventHandler(async (event) => {
  try {
    // get body from request
    const req_body = await readBody(event);
    const runtimeConfig = useRuntimeConfig();

    if (!req_body.access_token) return { statusCode: 400, status: "error" };

    const user: any = await $fetch("https://api.github.com/user", {
      headers: {
        Authorization: "Bearer " + req_body.access_token,
        "Content-Type": "application/json",
      },
      method: "GET",
    });

    // get user from db
    const db = await DBConnector.get_instance();
    var db_user = await db.get_user_by_auth_id(user.id);

    // create new user if no existing found or update existing user with auth info
    if (!db_user) {
      await db.add_new_user("github", user.id, user.login);
      db_user = await db.get_user_by_auth_id(user.id);
    } else await db.update_user_auth("github", user.id, user.login);

    // sign userdata token
    const token = jwt.sign(
      { id_user: db_user?.id_user },
      runtimeConfig.JWT_SECRET,
      {
        expiresIn: runtimeConfig.JWT_TOKEN_EXPIRATION,
      }
    );

    // send token
    return {
      status: "ok",
      access_token: req_body.access_token,
      jwt: token,
      user: {
        id_user: db_user?.id_user,
        display_name: db_user?.display_name,
        stats: db_user?.stats,
        auth: db_user?.auth,
      },
    };
  } catch (e) {
    return { statusCode: 400, status: "error" };
  }
});
