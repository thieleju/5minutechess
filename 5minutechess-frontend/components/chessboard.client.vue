<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import Board from "~~/composables/Board";

// const { default_board, fen_to_board } = useChess();

// const board = ref(default_board());

const board = ref(new Board());

// function get_piece_img_path(piece) {
//   return new URL(`../assets/pieces/${piece}.png`, import.meta.url).href;
// }

// function startDrag(e, item) {
//   console.log("start drag", item);
//   e.dataTransfer.dropEffect = "move";
//   e.dataTransfer.effectAllowed = "move";
//   e.dataTransfer.setData("itemID", item.id);
// }

// function onDrop(evt, list) {
//   console.log("on drop", evt, list);
//   // const itemID = evt.dataTransfer.getData("itemID");
//   // const item = this.items.find((item) => item.id == itemID);
//   // item.list = list;
// }

function get_piece_url(file) {
  return new URL(file, import.meta.url).href;
}
</script>

<template>
  <v-row align="center">
    <v-col cols="12" class="container">
      <div class="title">
        <v-icon left>mdi-chess-queen</v-icon>
        <p class="titleText">Chessboard</p>
        <v-spacer></v-spacer>
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
              @drop="onDrop($event, 1)"
              @dragover.prevent
              @dragenter.prevent
              :class="{
                'white-square': (x + y) % 2 === 0,
                'black-square': (x + y) % 2 === 1,
              }"
            >
              <div class="v-btn--absolute">
                {{ board.fields[x][y].notation }}
              </div>

              <!-- add piece to square -->
              <div class="piece" v-if="board.fields[x][y]">
                <!-- PIECE -->
                <v-img
                  :src="get_piece_url(board.fields[x][y]?.piece?.image)"
                  @dragstart="startDrag($event, { row, col })"
                  draggable="true"
                  link
                >
                </v-img>
              </div>
            </div>
          </div>
        </div>
      </div>
    </v-col>
  </v-row>
</template>

<style lang="scss">
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

.container {
  //max-height: 600px;
  max-width: 80vh;
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
