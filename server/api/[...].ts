export default defineEventHandler(() => {
  return { statusCode: 400, status: "error", message: "Route not found!" };
});
