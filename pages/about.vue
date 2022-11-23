<script setup>
const items = ref([
  {
    title:
      "Improved UI with graphs for votes and better move history annotation",
  },
  {
    title: "Leaderboard with top 20 players with most moves",
  },
  {
    title:
      "Settings to flip board, switch annotation, highlight moves and draw arrows",
  },
  {
    title:
      "Account page with stats (games played, w/l/d, etc) and achievements",
  },
  {
    title: "View history of games played",
  },
  {
    title: "Every 10th game is a chess960/fischer-random game",
  },
]);
</script>
// q: what is the meaning of life? //

<template>
  <v-main>
    <main-container
      icon="mdi-information"
      text="About"
      :size="{
        xs: 12,
        sm: 8,
        md: 7,
        lg: 7,
        xl: 5,
      }"
    >
      <v-card-title class="text-h5 ml-10 mt-5"
        >5 Minute Chess - Early Demo</v-card-title
      >
      <v-card-title class="ml-10 mt-5"
        >Every 5 minutes the most voted chess move is played on the board.
      </v-card-title>
      <v-card-title class="ml-10 mt-5">Planned features:</v-card-title>
      <v-list class="my-5 mx-10">
        <v-list-item
          v-for="item in items"
          :key="item.title"
          :title="item.title"
          prepend-icon="mdi-minus"
        >
        </v-list-item>
      </v-list>
      <v-btn
        class="mx-auto mb-5"
        color="background"
        @click="
          navigateTo('https://github.com/thieleju/5minutechess', {
            external: true,
          })
        "
        >❤️ View this project on GitHub</v-btn
      >
    </main-container>
  </v-main>
</template>
