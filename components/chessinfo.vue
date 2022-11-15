<script setup>
import { ref, unref, computed, onMounted, onUnmounted } from "vue";

// For some reason, this is only working with an invalid activ_tab value (:
const active_tab = ref(12);
const time = ref("0:00");

const info_text = useInfoText();
const game_result = useGameResult();

var interval_timer = null;
var interval_votes = null;

// const {
//   pending,
//   refresh,
//   data: vote_update,
// } = useLazyAsyncData("vote_update", () => $fetch("/api/game/vote_update"));

const { data: vote_update, refresh: refresh_votes } = await useAsyncData(
  "vote_update",
  () => $fetch(`/api/game/vote_update`),
  { initialCache: false }
);
const { data: board, refresh: refresh_board } = await useAsyncData(
  "board_update",
  () => $fetch(`/api/game/board_update`),
  { initialCache: false }
);

// watch(vote_update, (data) => {
//   console.log("vote_update", data);
// });
// watch(board, (data) => {
//   console.log("board update", data);
// });

onMounted(() => {
  // update timer every second
  interval_timer = setInterval(async () => {
    const timestamp = unref(vote_update).timestamp_next;

    // get difference between current time and timestamp
    const difference = new Date(timestamp).getTime() - new Date().getTime();

    // reload page when countdown is over
    if (difference <= 0) {
      // TODO manual refetch to avoid bug in production
      // vote_update.value = await $fetch("/api/game/vote_update");
      // await refresh();
      await refresh_board();
      await refresh_votes();

      await refreshNuxtData("vote_update");
      await refreshNuxtData("board_update");
      // vote_update = await useVoteUpdate();
      // board = await useBoardUpdate();

      // console.log(
      //   "vote_update next timestamp",
      //   new Date(unref(vote_update).timestamp_next).toLocaleTimeString()
      // );
      info_text.value = "";

      // check if game has ended
      if (game_result.value)
        info_text.value = `Game ended, ${game_result.value}!`;

      return;
    }

    // calculate minutes and seconds from difference
    const minutes = Math.floor(difference / 1000 / 60);
    const seconds = Math.floor((difference / 1000) % 60);

    // set time as countdown to timestamp
    time.value = `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;

    // set dynamic site title
    useHead({
      title: `${time.value} - 5 Minute Chess`,
    });
  }, 1000);

  // update interval every 3 seconds to update votes
  interval_votes = setInterval(async () => {
    await refreshNuxtData("vote_update");
    await refresh_votes();
  }, 3000);
});

onUnmounted(() => {
  clearInterval(interval_timer);
  clearInterval(interval_votes);
});

const votes_sorted = computed(() => {
  // get votes array from ref
  const votes = unref(vote_update).votes;
  // console.log(votes[0], votes);
  if (!votes) return [];

  let counted = [];
  votes.forEach((vote) => {
    let found = counted.find((c) => c.san == vote.san);
    if (found) {
      found.count++;
      found.users = [].concat(found.users, vote.user);
      found.title = get_vote_title(vote.san, found.count, found.users);
    } else
      counted.push({
        san: vote.san,
        count: 1,
        users: [vote.user],
        title: get_vote_title(vote.san, 1, [vote.user]),
      });
  });
  // sort array by count
  return counted.sort((a, b) => b.count - a.count);
});

function get_vote_title(san, count, users) {
  return `${san} | ${count} vote${count > 1 ? "s" : ""} | ${users.join(", ")}`;
}

function get_move_title(move) {
  const is_white_move = move.move_nr % 2 == 0;
  if (is_white_move)
    return `${move.move_nr / 2 + 1}. ${move.san} | ${move.users.join(", ")}`;
  else return `... ${move.san} | ${move.users.join(", ")}`;
}
</script>

<template>
  <div class="title">
    <v-icon class="my-auto" left>mdi-chess-bishop</v-icon>
    <p class="titleText text-h6">Game {{ vote_update.id_game }}</p>
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
      v-model="active_tab"
      centered
      fixed-tabs
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
          <v-list class="overflow-y-auto" height="18vh">
            <!-- list with alternating colors -->
            <v-list-item
              v-if="votes_sorted?.length > 0"
              v-for="vote in votes_sorted"
              :key="vote.move"
              class="overflow-y-auto"
              :title="vote.title"
              prepend-icon="mdi-chess-pawn"
            >
            </v-list-item>
            <v-list-item
              v-else
              title="No votes yet!"
              prepend-icon="mdi-chess-pawn"
            ></v-list-item>
          </v-list>
        </v-card>
      </v-window-item>
      <!-- MOVES -->
      <v-window-item>
        <v-card class="mx-2 mb-2" elevation="2">
          <v-list class="overflow-y-auto" height="18vh">
            <!-- list with alternating colors -->
            <v-list-item
              v-if="vote_update.moves?.length > 0"
              v-for="move in vote_update?.moves"
              :key="move.move_nr"
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
    <div v-if="info_text" class="text-center text-h6 py-3">
      {{ info_text }}
    </div>
    <div v-else class="text-center text-h6 py-3">
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
