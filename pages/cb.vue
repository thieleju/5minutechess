<script setup>
// get query parameter
const access_token = ref(useRoute()?.query?.access_token);
const platform = ref(useRoute()?.query?.platform);

// const store_user = useUserStore();
const state_user = useStateUser();

onMounted(async () => {
  if (!platform.value || !access_token.value) {
    navigateTo("/");
    return;
  }

  const response = await $fetch(`/api/auth/${platform.value}/token`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: { access_token: access_token.value },
  });

  if (!response.success) return;

  state_user.value = {
    platform,
    username: response.username,
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
  <div v-if="access_token || platform" class="mt-10 ma-auto text-center">
    Login successful, redirecting ...
  </div>
  <div v-else class="mt-10 ma-auto text-center">
    Login failed, redirecting ...
  </div>
</template>
