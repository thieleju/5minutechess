export default defineNuxtPlugin((nuxtApp) => {
  // Doing something with nuxtApp
  // try to autologin from local storage
  // read state from local storage
  const state_user = useStateUser();
  const storage_string = localStorage.getItem("state_user");

  if (!storage_string) {
    console.log("Autologin failed");
    return;
  }

  state_user.value = JSON.parse(storage_string);

  console.log(
    `Autologin for user ${state_user.value.username} from localStorage`
  );

  // not working atm
  // nuxtApp.provide("$logout", () => localStorage.removeItem("state_user"));
});
