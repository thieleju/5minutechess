<script setup>
// get query parameter
const access_token = ref(useRoute()?.query?.access_token);

// const store_user = useUserStore();
const state_user = useStateUser();

onMounted(async () => {
  if (!access_token.value) navigateTo("/account");

  const response = await $fetch("/api/auth/token", {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: { access_token: access_token.value },
  });

  state_user.value = {
    platform: "github",
    username: response.user.login,
    access_token: response.access_token,
    jwt: response.jwt,
  };
  localStorage.setItem("state_user", JSON.stringify(state_user.value));

  // store_user.set_access_token(response.access_token);
  // store_user.set_jwt(response.jwt);
  // store_user.set_user_github(response);

  navigateTo("/");
});
</script>

<template>
  <div v-if="access_token" class="mt-10 ma-auto text-center">
    Login successful, redirecting ...
  </div>
  <div v-else class="mt-10 ma-auto text-center">
    Login failed, redirecting ...
  </div>
</template>
