import jwt from "jsonwebtoken";

export default defineEventHandler(async (event) => {
  try {
    // get body from request
    const req_body = await readBody(event);
    const runtimeConfig = useRuntimeConfig();

    if (!req_body.access_token) return { statusCode: 400, status: "error" };

    const user: any = await $fetch("https://lichess.org/api/account", {
      headers: {
        Authorization: "Bearer " + req_body.access_token,
        "Content-Type": "application/json",
      },
      method: "GET",
    });

    // sign userdata token
    const token = jwt.sign(
      { username: user.username },
      runtimeConfig.JWT_SECRET,
      {
        expiresIn: runtimeConfig.JWT_TOKEN_EXPIRATION,
      }
    );

    // send token
    return {
      status: "ok",
      access_token: req_body.access_token,
      username: user.username,
      jwt: token,
    };
  } catch (e) {
    return { statusCode: 400, status: "error" };
  }
});
