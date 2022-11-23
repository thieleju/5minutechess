<script setup>
definePageMeta({
  middleware: ["guard-routes"],
});

const state_user = useStateUser();
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
      <v-container>
        <div v-if="state_user?.user" class="ma-auto">
          Logged in as <strong>{{ state_user?.user.display_name }}</strong>
          <!-- <v-btn color="background" @click="doLogout">Logout</v-btn> -->
        </div>
        <div>{{ state_user?.user.id_user }}</div>
        <div>{{ state_user?.user.display_name }}</div>
        <!-- <div>{{ state_user?.user.stats }}</div> -->
        <div>lichess {{ state_user?.user.auth.lichess }}</div>
        <div>github {{ state_user?.user.auth.github }}</div>
        <div>discord {{ state_user?.user.auth.discord }}</div>
        <v-row class="ma-auto text-center">
          <v-col cols="12">
            <v-btn
              color="background"
              @click="useDoLoginGithub"
              prepend-icon="mdi-github"
              >Connect GitHub Account</v-btn
            >
          </v-col>
          <v-col cols="12">
            <v-btn
              color="background"
              @click="useDoLoginDiscord"
              prepend-icon="mdi-ghost"
              >Connect Discord Account</v-btn
            >
          </v-col>
          <v-col cols="12">
            <v-btn
              color="background"
              @click="useDoLoginLichess"
              prepend-icon="mdi-chess-knight"
              >Connect Lichess Account</v-btn
            >
          </v-col>
        </v-row>
      </v-container>
    </main-container>
  </v-main>
</template>
