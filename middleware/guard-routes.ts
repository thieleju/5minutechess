export default defineNuxtRouteMiddleware((to, from) => {
  // check if this is executed on server or on client side
  if (process.server) {
    // server side
    // TODO Reloading the /profile route always leads to redirect to home
    // The problem is that the state_user is not ready (dunno why)
    return navigateTo("/");
  } else {
    // client side
    const state_user = useStateUser();
    const user = unref(state_user);

    if (to.path === "/profile" && !user) {
      console.log("Route protected, redirecting to home");
      return navigateTo("/", { redirectCode: 301 });
    }
  }
});
