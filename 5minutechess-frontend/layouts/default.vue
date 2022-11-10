<script setup>
import { ref } from "vue";

const active_tab = ref(1);

const apps = [
  {
    name: "Chess",
    route: "/",
  },
  {
    name: "Profile",
    route: "/profile",
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
    <v-app-bar class="px-3" flat density="compact">
      <v-spacer></v-spacer>
      <v-tabs centered v-model="active_tab" color="primary">
        <v-tab
          v-for="(app, i) in apps"
          :key="i"
          :to="app.route"
          color="primary"
        >
          {{ app.name }}
        </v-tab>
      </v-tabs>
      <v-spacer></v-spacer>
    </v-app-bar>

    <v-main color="primary">
      <slot />
    </v-main>
  </v-app>
</template>

<style lang="scss"></style>
