<script setup>
import { ref, computed } from "vue";

const username = ref("0xju");

const { data } = await useFetch(
  () => `https://api.chess.com/pub/player/${username.value}`
);

const openLink = (link) => {
  window.open(link, "_blank");
};
</script>

<template>
  <main>
    <h1>Hey</h1>
    <div>
      <v-btn color="primary" prepend-icon="mdi-home">Button</v-btn>
      <v-btn color="secondary" icon="mdi-home"></v-btn>
      <v-text-field v-model="username" label="Enter Username"></v-text-field>

      <v-card class="mx-auto" max-width="344">
        <v-img class="ma-5" :src="data?.avatar" height="200px"></v-img>
        <v-card-title>{{ data?.username }}</v-card-title>
        <v-card-subtitle>{{ data?.name }} ({{ data?.status }})</v-card-subtitle>
        <v-card-actions>
          <v-btn color="primary" text link @click="openLink(data?.url)">
            Profile
          </v-btn>
        </v-card-actions>
      </v-card>
    </div>
  </main>
</template>
