export default defineNuxtRouteMiddleware((to, from) => {
  const state_user = useStateUser();
  if (to.path === "/profile" && !state_user.value) {
    return navigateTo("/");
  }
});
