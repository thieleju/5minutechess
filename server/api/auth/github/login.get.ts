export default defineEventHandler((event) => {
  const runtimeConfig = useRuntimeConfig();
  const url = `https://github.com/login/oauth/authorize?client_id=${runtimeConfig.GITHUB_CLIENT_ID}`;
  return { url };
});
