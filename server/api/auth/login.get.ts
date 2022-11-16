export default defineEventHandler(() => {
  const runtimeConfig = useRuntimeConfig();
  return {
    url: `https://github.com/login/oauth/authorize?client_id=${runtimeConfig.GITHUB_CLIENT_ID}`,
  };
});
