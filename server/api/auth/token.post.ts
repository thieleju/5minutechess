import jwt from "jsonwebtoken";

export default defineEventHandler(async (event) => {
  try {
    // get body from request
    const req_body = await readBody(event);
    const runtimeConfig = useRuntimeConfig();

    if (!req_body.access_token) return { status: "error" };

    const user: any = await $fetch("https://api.github.com/user", {
      headers: {
        Authorization: "Bearer " + req_body.access_token,
        "Content-Type": "application/json",
      },
      method: "GET",
    });

    // sign userdata token
    const token = jwt.sign({ login: user.login }, runtimeConfig.JWT_SECRET, {
      expiresIn: runtimeConfig.TOKEN_EXPIRATION,
    });

    // send token
    return {
      status: "ok",
      access_token: req_body.access_token,
      user: user,
      jwt: token,
    };
  } catch (e) {
    console.log(e);
    return { status: "error" };
  }
});
