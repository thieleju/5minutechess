export default defineEventHandler(async (event) => {
  try {
    // get code from query
    const query = getQuery(event);

    if (!query.code) return { statusCode: 400, status: "error" };

    const runtimeConfig = useRuntimeConfig();

    const body = {
      client_id: runtimeConfig.DISCORD_CLIENT_ID,
      client_secret: runtimeConfig.DISCORD_CLIENT_SECRET,
      code: query.code,
      grant_type: "authorization_code",
      redirect_uri: runtimeConfig.public.BASE_URL + "/api/auth/discord/cb",
      scope: "identify",
    };

    // use code query parameter to get access_token from discord
    const data: any = await $fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(body as any),
    });

    const url = `${runtimeConfig.public.BASE_URL}/cb?access_token=${data.access_token}&platform=discord`;
    // redirect
    return sendRedirect(event, url, 301);
  } catch (e) {
    console.log(e);
    return { statusCode: 400, status: "error" };
  }
});
