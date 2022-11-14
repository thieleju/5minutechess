<script setup>
import { ref, computed, watch, onMounted } from "vue";

const { pending, data: board } = useLazyAsyncData("board", () =>
  $fetch("/api/game/board_update")
);

async function vote_for_move(move) {
  await $fetch("/api/game/vote_move", {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: { move },
  });
}

function startDrag(e, item) {
  if (!item) return;
  e.dataTransfer.dropEffect = "move";
  e.dataTransfer.effectAllowed = "move";
  e.dataTransfer.setData("square", item.square);
}

// move piece on drop
async function onDrop(evt, xy) {
  // to location might be null if theres no piece on the square
  // because of that, we need to get the square from x and y coordinates
  const letter = ["a", "b", "c", "d", "e", "f", "g", "h"][xy[1]];
  const number = 8 - xy[0];
  const to_square = letter + number;
  const from_square = evt.dataTransfer.getData("square");

  // check which legal move was made
  const legal_moves = unref(board).legal_moves;
  const move = legal_moves.find(
    (move) => move.from == from_square && move.to == to_square
  );
  if (!move) return;

  await vote_for_move(move);
  await refreshNuxtData();
}

function get_piece_img(item) {
  if (!item) return;
  return `/pieces/${item.color}_${item.type}.png`;
}
</script>

<template>
  <div class="title">
    <v-icon class="my-auto" left>mdi-chess-queen</v-icon>
    <p class="titleText text-h6">5 Minute Chess - White to move</p>
  </div>
  <!-- <div class="ma-auto pa-auto" v-if="pending">
    <v-progress-circular
      class="ma-auto pa-auto"
      indeterminate
      color="primary"
    ></v-progress-circular>
  </div> -->
  <!-- css chessboard with 8x8 grid -->
  <div class="chessboard">
    <!-- loop through each row and column -->
    <div class="row" v-for="(row, y) in board?.board_setup" :key="row">
      <div class="column" v-for="(col, x) in board?.board_setup" :key="col">
        <!-- SQUARE -->
        <!-- alternate color of each square -->
        <div
          class="square drop-zone align-self-center"
          @drop="onDrop($event, `${x}${y}`)"
          @dragover.prevent
          @dragenter.prevent
          :class="{
            'white-square': (x + y) % 2 === 0,
            'black-square': (x + y) % 2 === 1,
          }"
        >
          <!-- <div class="v-btn--absolute text-black">
            {{ board?.board_setup[x][y]?.square }}
            {{ x }} {{ y }}
          </div> -->

          <!-- add piece to square -->
          <div class="piece" v-if="board?.board_setup[x][y]">
            <!-- PIECE -->
            <v-img
              v-if="board?.board_setup[x][y]"
              :src="get_piece_img(board?.board_setup[x][y])"
              @dragstart="startDrag($event, board?.board_setup[x][y])"
              draggable="true"
              link
              class="grabbable"
            ></v-img>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.grabbable {
  cursor: move; /* fallback if grab cursor is unsupported */
  cursor: grab;
  cursor: -moz-grab;
  cursor: -webkit-grab;
}

/* (Optional) Apply a "closed-hand" cursor during drag operation. */
.grabbable:active {
  cursor: grabbing;
  cursor: -moz-grabbing;
  cursor: -webkit-grabbing;
}

.notation {
  position: absolute;
  color: #000;
  font-size: 1rem;
  font-weight: bold;
}
.white-square {
  background-color: #e6f4f1;
  //background-color: #e6f4f1;
}
.black-square {
  background-color: #699292;
  //background-color: #95b0b1;
}
.chessboard {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  grid-gap: 0;
  //width: 500px;
  //height: 500px;
  //margin: 0 auto;
  // box border
  border: 4px solid #38a3a5;
}

.square {
  //min-width: 50px;
  //min-height: 50px;
  aspect-ratio: 1;
  object-fit: contain;
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
