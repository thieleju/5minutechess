<script setup>
const state_user = useStateUser();

watch(state_user, (new_user) => {
  console.log("user changed", new_user);
});

async function doLogout() {}
</script>

<template>
  <v-main>
    <main-container
      icon="mdi-account"
      text="My Account"
      :size="{
        xs: 12,
        sm: 8,
        md: 6,
        lg: 6,
        xl: 4,
      }"
    >
      <div v-if="state_user" class="ma-auto">
        Logged in as <strong>{{ state_user.username }}</strong> ({{
          state_user.platform
        }})
        <!-- <v-btn color="background" @click="doLogout">Logout</v-btn> -->
      </div>
      <div v-else class="ma-auto">
        <v-btn color="background" @click="useDoLogin" prepend-icon="mdi-github"
          >Login with GitHub</v-btn
        >
      </div>
    </main-container>
  </v-main>
</template>
