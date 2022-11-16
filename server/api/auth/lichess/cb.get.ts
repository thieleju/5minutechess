export default defineEventHandler(async (event) => {
  try {
    // get code from query
    const query = getQuery(event);

    if (!query.code) return { statusCode: 400, status: "error" };

    const runtimeConfig = useRuntimeConfig();

    const body = {
      grant_type: "authorization_code",
      redirect_uri: runtimeConfig.public.BASE_URL + "/api/auth/lichess/cb",
      client_id: runtimeConfig.LICHESS_CLIENT_ID,
      code: query.code,
      code_verifier: runtimeConfig.LICHESS_CLIENT_SECRET,
    };

    // use code query parameter to get access_token from discord
    const data: any = await $fetch("https://lichess.org/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const url = `${runtimeConfig.public.BASE_URL}/cb?access_token=${data.access_token}&platform=lichess`;
    // redirect
    return sendRedirect(event, url, 301);
  } catch (e) {
    console.log(e);
    return { statusCode: 400, status: "error" };
  }
});
