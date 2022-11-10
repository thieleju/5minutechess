<script setup>
import { ref, computed, watch, onMounted, getCurrentInstance } from "vue";

const active_tab = ref(0);
const time_seconds = ref(300);
const time = ref("5:00");

onMounted(() => {
  setInterval(() => {
    let minutes = Math.floor(time_seconds.value / 60);
    let seconds = time_seconds.value % 60;

    seconds = seconds < 10 ? "0" + seconds : seconds;

    time.value = minutes + ":" + seconds;
    if (time_seconds.value > 0) {
      time_seconds.value--;
    } else {
      time_seconds.value = 300;
    }
  }, 1000);
});

const votes = ref([
  {
    user: "user1",
    move: "e4",
  },
  {
    user: "user2",
    move: "d4",
  },
  {
    user: "user3",
    move: "e4",
  },
  {
    user: "user4",
    move: "c4",
  },
  {
    user: "user5",
    move: "a3",
  },
  {
    user: "user6",
    move: "b3",
  },
  {
    user: "user7",
    move: "e3",
  },
  {
    user: "user8",
    move: "d3",
  },
  {
    user: "user8",
    move: "e3",
  },
  {
    user: "user8",
    move: "f3",
  },
  {
    user: "user8",
    move: "g3",
  },
  {
    user: "user8",
    move: "d3",
  },
]);

const votes_count = computed(() => {
  let counted = [];
  // count same moves in array
  votes.value.forEach((vote) => {
    let found = counted.find((c) => c.move == vote.move);
    if (found) {
      found.count++;
      found.users = [].concat(found.users, vote.user);
      found.title = `${vote.move} | ${found.count} votes | ${found.users.join(
        ", "
      )}`;
    } else
      counted.push({
        move: vote.move,
        count: 1,
        users: [vote.user],
        title: `${vote.move} | 1 vote | ${vote.user}`,
      });
  });
  // sort array by count
  return counted.sort((a, b) => b.count - a.count);
});

const moves = ref([
  {
    id: 0,
    move: "e4",
    color: "white",
    votes: 3,
    users: ["user1", "user2", "user3"],
  },
  {
    id: 1,
    move: "e4",
    color: "black",
    votes: 3,
    users: ["user1"],
  },
]);
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
              v-if="votes_count.length > 0"
              v-for="vote in votes_count"
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
              v-if="moves.length > 0"
              v-for="move in moves"
              :key="move.id"
              class="overflow-y-auto"
              :title="
                move.id +
                1 +
                '. ' +
                move.move +
                ' | ' +
                move.votes +
                ' votes | ' +
                move.users.join(', ')
              "
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
