<script setup>
import { ref } from "vue";

const state_user = useStateUser();

const active_tab = ref(1);
</script>

<template>
  <v-app>
    <NuxtLoadingIndicator />
    <!-- UNUSED -->
    <v-app-bar class="px-3" flat density="compact">
      <v-spacer></v-spacer>
      <v-tabs centered v-model="active_tab" color="primary">
        <v-tab to="/" color="primary" class="tabText">Chess</v-tab>
        <v-tab to="/leaderboard" color="primary" class="tabText"
          >Leaderboard</v-tab
        >
        <v-tab v-if="state_user" to="/profile" color="primary" class="tabText"
          >Profile</v-tab
        >
        <v-tab to="/about" color="primary" class="tabText">About</v-tab>
      </v-tabs>
      <v-spacer></v-spacer>
    </v-app-bar>

    <v-main color="primary">
      <slot />
    </v-main>
  </v-app>
</template>

<style lang="scss">
.tabText {
  -webkit-font-smoothing: antialiased;
}
</style>
