export default defineEventHandler(async (event) => {
  try {
    // get code from query
    const query = getQuery(event);

    if (!query.code) return { status: "error" };

    const runtimeConfig = useRuntimeConfig();

    const body = {
      client_id: runtimeConfig.CLIENT_ID,
      client_secret: runtimeConfig.CLIENT_SECRET,
      code: query.code,
    };

    // use code query parameter to get access_token from github
    const data: any = await $fetch(
      "https://github.com/login/oauth/access_token",
      { method: "POST", body }
    );

    const url = "http://localhost:3000/cb?access_token=" + data.access_token;
    // redirect
    return sendRedirect(event, url, 301);
  } catch (e) {
    console.log(e);
    return { status: "error" };
  }
});
