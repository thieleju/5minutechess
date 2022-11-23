// This Plugin executes only on the client
export default defineNuxtPlugin((nuxtApp) => {
  // try to autologin from local storage
  const state_user = useStateUser();
  // read state from local storage
  const storage_string = localStorage.getItem("state_user");

  function doSimpleLogout() {
    localStorage.removeItem("state_user");
    console.log(`Autologin failed!`);
  }

  if (!storage_string) {
    doSimpleLogout();
    return;
  }

  // check stored token validity
  const storage = JSON.parse(storage_string);

  if (!storage.jwt || !storage?.user?.display_name || !storage.access_token) {
    doSimpleLogout();
    return;
  }

  $fetch("/api/auth/check_token", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${storage.jwt}`,
    },
    method: "get",
  })
    .then((res) => {
      if (res.status !== "ok") {
        doSimpleLogout();
        return;
      }

      // token still valid
      state_user.value = storage;

      console.log(
        `Autologin for user ${storage.user.display_name} successful!`
      );
    })
    .catch((err) => {
      console.log(`Check token error`, storage_string, err);
    });
});
