<script setup>
definePageMeta({
  middleware: ["guard-routes"],
});

const state_user = useStateUser();

const stats = computed(() => {
  return state_user.value.user.stats;
});

const platform = computed(() => {
  if (state_user.value.user.auth.lichess) return "lichess";
  if (state_user.value.user.auth.discord) return "discord";
  if (state_user.value.user.auth.github) return "github";
});

const user = computed(() => {
  return (
    state_user.value.user.auth.lichess ||
    state_user.value.user.auth.github ||
    state_user.value.user.auth.discord
  );
});

const username = ref(user.value.username);
const switch_visibility = ref(user.value.visibility == "public");
const switch_loading = ref(false);

const switch_label = computed(() => {
  return switch_visibility.value ? "Profile is Public" : "Profile is Private";
});

watch(switch_visibility, (val) => {
  switch_loading.value = true;
  setTimeout(() => {
    switch_loading.value = false;
  }, 1000);
});
</script>

<template>
  <v-main>
    <main-container
      icon="mdi-account"
      text="Profile"
      :size="{
        xs: 12,
        sm: 8,
        md: 6,
        lg: 6,
        xl: 6,
      }"
    >
      <v-container class="pb-0">
        <v-row class="ma-auto">
          <v-col cols="8">
            <v-text-field
              v-model="username"
              label="Username"
              prepend-icon="mdi-account"
              readonly
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-switch
              v-model="switch_visibility"
              :label="switch_label"
              :loading="switch_loading"
              :disabled="switch_loading"
              @click="switch_visibility = !switch_visibility"
              color="primary"
            ></v-switch>
          </v-col>
        </v-row>
      </v-container>
      <v-divider></v-divider>
      <v-container>
        <v-row>
          <v-col>
            <v-card class="px-4 py-2">
              <v-card-title class="pb-6"> Game Stats </v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="10">Games played in</v-col>
                  <v-col cols="2">{{ stats.games_played_in }}</v-col>
                </v-row>
                <v-row>
                  <v-col cols="10">Votes for white</v-col>
                  <v-col cols="2">{{ stats.votes_for_white }}</v-col>
                </v-row>
                <v-row>
                  <v-col cols="10">Votes for black</v-col>
                  <v-col cols="2">{{ stats.votes_for_white }}</v-col>
                </v-row>
                <v-row>
                  <v-col cols="10">Captures</v-col>
                  <v-col cols="2">{{ stats.captures }}</v-col>
                </v-row>
                <v-row>
                  <v-col cols="10">En Passant played</v-col>
                  <v-col cols="2">{{ stats.en_passant }}</v-col>
                </v-row>
                <v-row>
                  <v-col cols="10">Castle played</v-col>
                  <v-col cols="2">{{ stats.castle }}</v-col>
                </v-row>
                <v-row>
                  <v-col cols="10">Pawn promotions</v-col>
                  <v-col cols="2">{{ stats.promotion }}</v-col>
                </v-row>
                <v-row>
                  <v-col cols="10">Checks given</v-col>
                  <v-col cols="2">{{ stats.checks }}</v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col>
            <v-card class="px-4 py-2">
              <v-card-title class="pb-6">Moved Pieces</v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="10">Pawn</v-col>
                  <v-col cols="2">{{ stats.moved_pieces.pawn }}</v-col>
                </v-row>
                <v-row>
                  <v-col cols="10">Knight</v-col>
                  <v-col cols="2">{{ stats.moved_pieces.knight }}</v-col>
                </v-row>
                <v-row>
                  <v-col cols="10">Bishop</v-col>
                  <v-col cols="2">{{ stats.moved_pieces.bishop }}</v-col>
                </v-row>
                <v-row>
                  <v-col cols="10">Rook</v-col>
                  <v-col cols="2">{{ stats.moved_pieces.rook }}</v-col>
                </v-row>
                <v-row>
                  <v-col cols="10">Queen</v-col>
                  <v-col cols="2">{{ stats.moved_pieces.queen }}</v-col>
                </v-row>
                <v-row>
                  <v-col cols="10">King</v-col>
                  <v-col cols="2">{{ stats.moved_pieces.king }}</v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <!-- <v-row class="ma-auto text-center">
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
        </v-row> -->
      </v-container>
    </main-container>
  </v-main>
</template>
