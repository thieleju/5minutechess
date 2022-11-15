export default defineEventHandler(() => {
  return {
    url: `https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}`,
  };
});
