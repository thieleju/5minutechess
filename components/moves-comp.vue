<script setup>
// define props

const { data: votes, refresh: refresh_votes } = await useVoteUpdate();
const { data: board, refresh: refresh_board } = await useBoardUpdate();

function get_piece_icon(piece) {
  if (piece == "p") return "mdi-chess-pawn";
  if (piece == "n") return "mdi-chess-knight";
  if (piece == "b") return "mdi-chess-bishop";
  if (piece == "r") return "mdi-chess-rook";
  if (piece == "q") return "mdi-chess-queen";
  if (piece == "k") return "mdi-chess-king";
}
</script>

<template>
  <div v-for="(move, i) in board.moves" :key="i">
    <!-- two moves in one line -->
    <div v-if="move.move_nr % 2 == 0">
      <v-list-item class="overflow-y-auto pl-10">
        <v-row dense>
          <v-col cols="2" class="text-body-1">
            {{ board.moves[i]?.move_nr / 2 + 1 }}.
          </v-col>
          <v-col class="text-body-1">
            <v-icon v-if="board.moves[i]?.piece">{{
              get_piece_icon(board.moves[i]?.piece)
            }}</v-icon>
            {{ board.moves[i]?.san }}
          </v-col>
          <v-col class="text-body-1">
            <v-icon v-if="board.moves[i + 1]?.piece">{{
              get_piece_icon(board.moves[i + 1]?.piece)
            }}</v-icon>
            {{ board.moves[i + 1]?.san }}
          </v-col>
        </v-row>
      </v-list-item>
      <v-divider></v-divider>
    </div>
  </div>
  <div v-if="!board.moves?.length" class="fill-height ma-auto text-center">
    <v-list-item class="fill-height">
      <v-card-title> No moves yet!</v-card-title>
    </v-list-item>
  </div>
</template>
