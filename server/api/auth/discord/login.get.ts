export default defineEventHandler((event) => {
  const runtimeConfig = useRuntimeConfig();
  const base_url = `https://discord.com/api/oauth2/authorize`;
  const redirect_uri = encodeURIComponent(
    runtimeConfig.public.BASE_URL + "/api/auth/discord/cb"
  );
  const url = `${base_url}?client_id=${runtimeConfig.DISCORD_CLIENT_ID}&redirect_uri=${redirect_uri}&response_type=code&scope=identify`;
  return { url };
});
