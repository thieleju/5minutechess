<script setup>
// define props

const props = defineProps({
  vote: {
    san: {
      type: String,
      default: "",
    },
    move_nr: {
      type: Number,
      default: 0,
    },
    count: {
      type: Number,
      default: 1,
    },
    users: {
      type: Array,
      default: [],
    },
    piece: {
      type: String,
      default: "",
    },
    flags: {
      type: String,
      default: "",
    },
  },
  count_max: {
    type: Number,
    default: 0,
  },
});

const piece_icon = computed(() => {
  const piece = props.vote.piece;
  if (piece == "p") return "mdi-chess-pawn";
  if (piece == "n") return "mdi-chess-knight";
  if (piece == "b") return "mdi-chess-bishop";
  if (piece == "r") return "mdi-chess-rook";
  if (piece == "q") return "mdi-chess-queen";
  if (piece == "k") return "mdi-chess-king";
});

const { data: board, refresh: refresh_board } = await useBoardUpdate();
</script>

<template>
  <v-list-item
    v-if="props.vote"
    :prepend-icon="piece_icon"
    class="overflow-y-auto pl-10"
  >
    <v-row dense>
      <v-col cols="3"
        ><v-list-item-title class="text-body-1">
          <p>
            {{ Math.floor(board.moves.length / 2) + 1 }}. {{ props.vote.san }}
          </p>
        </v-list-item-title></v-col
      >
      <v-col
        ><v-list-item-subtitle class="mb-1">{{
          props.vote.users.join(", ")
        }}</v-list-item-subtitle>
        <v-progress-linear
          :model-value="(props.vote.count / props.count_max) * 100"
          class="mx-auto fill-height"
        ></v-progress-linear
      ></v-col>
    </v-row>
  </v-list-item>
  <v-list-item v-else class="fill-height ma-auto text-center">
    <v-card-title
      >{{ props.turn == "w" ? "White" : "Black" }} to move!
    </v-card-title>
  </v-list-item>
  <v-divider v-if="props.vote && props"></v-divider>
</template>
