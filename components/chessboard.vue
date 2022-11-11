<script setup>
import { ref, computed, watch, onMounted } from "vue";
import Board from "~~/server/utils/Board";

const board = ref(new Board());

const { data: current_game } = await useLazyFetch("/api/game/current_game");

function get_piece_url(file) {
  return new URL(file, import.meta.url).href;
}

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
  e.dataTransfer.dropEffect = "move";
  e.dataTransfer.effectAllowed = "move";
  e.dataTransfer.setData("notation", item.notation);
}

// move piece on drop
async function onDrop(evt, field_to) {
  const notation = evt.dataTransfer.getData("notation");

  // temporary move validation

  if (!notation) return;

  let field_from = board.value.get_field_by_notation(notation);

  if (field_from.notation == field_to.notation) return;

  if (
    field_from.piece &&
    field_to.piece &&
    field_from.piece.white === field_to.piece.white
  )
    return;

  board.value.move(field_from, field_to);
  await vote_for_move(`${field_from.notation}${field_to.notation}`);
  await refreshNuxtData();
}
</script>

<template>
  <div class="title">
    <v-icon class="my-auto" left>mdi-chess-queen</v-icon>
    <p class="titleText text-h6">5 Minute Chess - Game 1</p>
  </div>
  <!-- css chessboard with 8x8 grid -->
  <div class="chessboard">
    <!-- loop through each row and column -->
    <div class="row" v-for="(row, y) in board.fields" :key="row">
      <div class="column" v-for="(col, x) in board.fields" :key="col">
        <!-- SQUARE -->
        <!-- alternate color of each square -->
        <div
          class="square drop-zone align-self-center"
          @drop="onDrop($event, board.fields[x][y])"
          @dragover.prevent
          @dragenter.prevent
          :class="{
            'white-square': (x + y) % 2 === 0,
            'black-square': (x + y) % 2 === 1,
          }"
        >
          <!-- <div class="v-btn--absolute">
                {{ board.fields[x][y].notation }}
              </div> -->

          <!-- add piece to square -->
          <div class="piece" v-if="board.fields[x][y]">
            <!-- PIECE -->
            <v-img
              v-if="board.fields[x][y].piece"
              :src="get_piece_url(board.fields[x][y].piece.image)"
              @dragstart="startDrag($event, board.fields[x][y])"
              draggable="true"
              link
              class="grabbable"
            >
            </v-img>
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
