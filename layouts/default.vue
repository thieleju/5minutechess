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
    <!-- Loading indicator -->
    <NuxtLoadingIndicator />
    <!-- App Bar -->
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

    <!-- Particles backgroung -->
    <client-only>
      <particles-comp></particles-comp>
    </client-only>

    <!-- Main View -->
    <v-main class="bring_to_front">
      <slot />
    </v-main>
  </v-app>
</template>

<style lang="scss">
.tabText {
  -webkit-font-smoothing: antialiased;
}

.bring_to_front {
  z-index: 5;
}
</style>
