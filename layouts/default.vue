<script setup>
const active_tab = ref(1);
const state_user = useStateUser();

const apps = [
  {
    name: "Chess",
    route: "/",
  },
  {
    name: "Leaderboard",
    route: "/leaderboard",
  },
  {
    name: "Profile",
    route: "/profile",
    guard: true,
  },
  {
    name: "About",
    route: "/about",
  },
];
</script>

<template>
  <v-app>
    <NuxtLoadingIndicator />
    <!-- UNUSED -->
    <!-- <particles></particles> -->
    <v-app-bar class="px-3" flat density="compact">
      <v-spacer></v-spacer>
      <v-tabs centered v-model="active_tab" color="primary">
        <div v-for="(app, i) in apps" :key="i">
          <v-tab
            v-if="state_user || !app.guard"
            :to="app.route"
            color="primary"
            class="tabText"
          >
            {{ app.name }}
          </v-tab>
        </div>
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
