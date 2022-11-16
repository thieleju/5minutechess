export default defineEventHandler(async (event) => {
  try {
    // get code from query
    const query = getQuery(event);

    if (!query.code) return { statusCode: 400, status: "error" };

    const runtimeConfig = useRuntimeConfig();

    const body = {
      client_id: runtimeConfig.GITHUB_CLIENT_ID,
      client_secret: runtimeConfig.GITHUB_CLIENT_SECRET,
      code: query.code,
    };

    // use code query parameter to get access_token from github
    const data: any = await $fetch(
      "https://github.com/login/oauth/access_token",
      { method: "POST", body }
    );

    const url = `${runtimeConfig.public.BASE_URL}/cb?access_token=${data.access_token}`;
    // redirect
    return sendRedirect(event, url, 301);
  } catch (e) {
    console.log(e);
    return { statusCode: 400, status: "error" };
  }
});
