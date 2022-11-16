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
      <v-row v-else class="ma-auto text-center">
        <v-col cols="12">
          <v-btn
            color="background"
            @click="useDoLoginGithub"
            prepend-icon="mdi-github"
            >Login with GitHub</v-btn
          >
        </v-col>
        <v-col cols="12">
          <v-btn
            color="background"
            @click="useDoLoginDiscord"
            prepend-icon="mdi-ghost"
            >Login with Discord</v-btn
          >
        </v-col>
        <v-col cols="12">
          <v-btn
            color="background"
            @click="useDoLoginLichess"
            prepend-icon="mdi-chess-knight"
            >Login with Lichess</v-btn
          >
        </v-col>
      </v-row>
    </main-container>
  </v-main>
</template>
