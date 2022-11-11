<script setup>
import { ref, unref, computed, onMounted } from "vue";

const active_tab = ref(0);
const time = ref("0:00");
const { data: timestamp_ref } = await useFetch("/api/game/timestamp");
const { data: votes_ref } = await useFetch("/api/game/votes");
const { data: moves_ref } = await useFetch("/api/game/moves");

onMounted(() => {
  // update every second
  setInterval(() => {
    const obj = unref(timestamp_ref);

    // get difference between current time and timestamp
    const difference = new Date(obj.timestamp).getTime() - new Date().getTime();

    // reload page when countdown is over
    if (difference <= 0) window.location.reload();

    // calculate minutes and seconds from difference
    const minutes = Math.floor(difference / 1000 / 60);
    const seconds = Math.floor((difference / 1000) % 60);

    // set time as countdown to timestamp
    time.value = `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
  }, 1000);
});

const votes_sorted = computed(() => {
  // get votes array from ref
  const votes = unref(votes_ref);
  if (!votes) return [];

  let counted = [];
  votes.forEach((vote) => {
    let found = counted.find((c) => c.move == vote.move);
    if (found) {
      found.count++;
      found.users = [].concat(found.users, vote.user);
      found.title = get_vote_title(vote.move, found.count, found.users);
    } else
      counted.push({
        move: vote.move,
        count: 1,
        users: [vote.user],
        title: get_vote_title(vote.move, 1, [vote.user]),
      });
  });
  // sort array by count
  return counted.sort((a, b) => b.count - a.count);
});

function get_vote_title(move, count, users) {
  return `${move} | ${count} vote${count > 1 ? "s" : ""} | ${users.join(", ")}`;
}

function get_move_title(move) {
  return `${move.id_move + 1}. ${move.move} | ${move.votes} vote${
    move.votes > 1 ? "s" : ""
  } | ${move.users.join(", ")}`;
}
</script>

<template>
  <div class="title">
    <v-icon class="my-auto" left>mdi-information</v-icon>
    <p class="titleText text-h6">Info</p>
    <v-spacer></v-spacer>
  </div>
  <div class="chessinfo">
    <p class="mt-5 text-center text-h4">Next move in</p>
    <div class="mx-16 my-3 px-0">
      <p class="text-center text-h1 border-xl">
        {{ time }}
      </p>
    </div>
    <v-tabs
      centered
      fixed-tabs
      v-model="active_tab"
      color="primary"
      class="mt-6"
    >
      <v-spacer></v-spacer>
      <v-tab>Votes</v-tab>
      <v-tab>Moves</v-tab>
      <v-spacer></v-spacer>
    </v-tabs>
    <v-window v-model="active_tab">
      <!-- VOTES -->
      <v-window-item>
        <v-card class="mx-2 mb-2" elevation="2">
          <v-list class="overflow-y-auto" max-height="30vh">
            <!-- list with alternating colors -->
            <v-list-item
              v-if="votes_sorted.length > 0"
              v-for="vote in votes_sorted"
              :key="vote.move"
              class="overflow-y-auto"
              :title="vote.title"
              prepend-icon="mdi-chess-pawn"
            >
            </v-list-item>
            <v-list-item
              v-else
              title="Go ahead and make the first move!"
              prepend-icon="mdi-chess-pawn"
            ></v-list-item>
          </v-list>
        </v-card>
      </v-window-item>
      <!-- MOVES -->
      <v-window-item>
        <v-card class="mx-2 mb-2" elevation="2">
          <v-list class="overflow-y-auto" max-height="30vh">
            <!-- list with alternating colors -->
            <v-list-item
              v-if="moves_ref.length > 0"
              v-for="move in moves_ref"
              :key="move.id"
              :title="get_move_title(move)"
              class="overflow-y-auto"
              prepend-icon="mdi-chess-pawn"
            >
            </v-list-item>
            <v-list-item
              v-else
              title="No moves yet!"
              prepend-icon="mdi-chess-pawn"
            ></v-list-item>
          </v-list>
        </v-card>
      </v-window-item>
    </v-window>
    <v-divider></v-divider>
    <v-spacer></v-spacer>
    <div class="text-center text-h6 py-3">
      Vote for a move by dragging the piece
    </div>
  </div>
</template>

<style lang="scss">
.chessinfo {
  width: 500px;
  //height: 500px;
  margin: auto;
  padding: auto;
}

.container {
  //max-height: 600px;
  //max-width: 80vh;
  background-color: #2d2d2d;
  //margin-top: 0;
  margin-left: auto;
  margin-right: auto;
  padding: 0px;
  border-radius: 10px;
  //z-index: 5;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}

.headCont {
  display: flex;
  flex-direction: column;
  min-height: 20vh;
}

.innerPadding {
  padding: 10px;
}

.title {
  display: flex;
  background: #38a3a5;
  margin: 0;
  margin-right: 0;
  // margin-left: -12px;
  // margin-top: -12px;
  border-radius: 10px 10px 0 0;
  padding: 10px;
  padding-left: 15px;
  padding-bottom: 7px;
  //border-bottom: solid 3px #2d2d2d;
}

.titleText {
  margin-left: 10px;
}

.textInputHeading {
  padding-top: 8vh;
}
</style>
