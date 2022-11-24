<script setup>
// define props

const { data: votes, refresh: refresh_votes } = await useVoteUpdate();
const { data: board, refresh: refresh_board } = await useBoardUpdate();

const votes_sorted = computed(() => {
  // get votes array from ref
  const v = unref(votes).votes;

  if (!v) return [];

  let counted = [];
  v.forEach((vote) => {
    let found = counted.find((c) => c.san == vote.san);
    if (found) {
      found.count++;
      found.users = [].concat(found.users, vote.display_name);
    } else
      counted.push({
        san: vote.san,
        move_nr: vote.move_nr,
        count: 1,
        users: [vote.display_name],
        piece: vote.piece,
        flags: vote.flags,
      });
  });
  // sort array by count
  return counted.sort((a, b) => b.count - a.count);
});

function get_piece_icon(piece) {
  if (piece == "p") return "mdi-chess-pawn";
  if (piece == "n") return "mdi-chess-knight";
  if (piece == "b") return "mdi-chess-bishop";
  if (piece == "r") return "mdi-chess-rook";
  if (piece == "q") return "mdi-chess-queen";
  if (piece == "k") return "mdi-chess-king";
}

const count_votes = computed(() => {
  var c = 0;
  votes_sorted.value.forEach((v) => {
    c += v.count;
  });
  return c;
});
</script>

<template>
  <div v-for="vote in votes_sorted">
    <v-list-item
      :prepend-icon="get_piece_icon(vote.piece)"
      class="overflow-y-auto pl-10"
    >
      <v-row dense>
        <v-col cols="3"
          ><v-list-item-title class="text-body-1">
            <p>{{ Math.floor(board.moves.length / 2) + 1 }}. {{ vote.san }}</p>
          </v-list-item-title></v-col
        >
        <v-col>
          <v-list-item-subtitle class="mb-1">{{
            vote.users.join(", ")
          }}</v-list-item-subtitle>
          <v-progress-linear
            :model-value="(vote.count / count_votes) * 100"
            class="mx-auto fill-height"
          >
          </v-progress-linear>
        </v-col>
      </v-row>
    </v-list-item>
    <v-divider></v-divider>
  </div>
  <div v-if="!votes_sorted.length" class="fill-height ma-auto text-center">
    <v-list-item class="fill-height">
      <v-card-title
        >{{ board.turn == "w" ? "White" : "Black" }} to move!
      </v-card-title>
    </v-list-item>
  </div>
</template>
