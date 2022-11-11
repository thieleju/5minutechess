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
  <v-main>
    <main-container
      icon="mdi-account"
      text="Chess Profiles"
      :size="{
        xs: 12,
        sm: 8,
        md: 6,
        lg: 6,
        xl: 4,
      }"
    >
      <v-text-field
        v-model="username"
        label="Enter chess.com username"
      ></v-text-field>
      <v-card v-if="data">
        <v-row>
          <v-col class="mx-9 align-self-center">
            <v-card-title>{{ data?.username }}</v-card-title>
            <v-card-subtitle
              >{{ data?.name }} ({{ data?.status }})</v-card-subtitle
            >
            <v-card-actions>
              <v-btn color="primary" text link @click="openLink(data?.url)">
                Profile
              </v-btn>
            </v-card-actions>
          </v-col>
          <v-col>
            <v-img :src="data?.avatar" class="mx-auto"></v-img>
          </v-col>
        </v-row>
      </v-card>
      <v-card v-else>
        <v-card-title>User `{{ username }}` could not be found!</v-card-title>
      </v-card>
    </main-container>
  </v-main>
</template>
