<script setup>
const { data: leaderboard, refresh: refresh_leaderboard } =
  await useLeaderboard();

await refresh_leaderboard();
</script>

<template>
  <v-main>
    <main-container
      icon="mdi-trophy"
      text="Leaderboard"
      :size="{
        xs: 12,
        sm: 8,
        md: 6,
        lg: 6,
        xl: 4,
      }"
    >
      <v-container class="mb-3">
        <v-card-title>Top 10</v-card-title>
        <v-list class="mx-4" min-height="20vh">
          <v-list-item
            v-for="item in leaderboard"
            :key="item.id_user"
            prepend-icon="mdi-minus"
          >
            <v-list-item-title>
              <v-row>
                <v-col>
                  {{ item.display_name }}
                </v-col>
                <v-col> Votes: {{ item.stats.votes_count }} </v-col>
              </v-row>
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-container>
    </main-container>
  </v-main>
</template>
