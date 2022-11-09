<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from "vue";

const { default_board, fen_to_board } = useChess();

const board = ref(default_board());

function get_piece_img_path(piece) {
  return new URL(`../assets/pieces/${piece}.png`, import.meta.url).href;
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
        <div class="column" v-for="column in 8" :key="column">
          <div class="row" v-for="row in 8" :key="row">
            <!-- alternate color of each square -->
            <div
              class="square"
              :class="{
                'white-square': (row + column) % 2 === 0,
                'black-square': (row + column) % 2 === 1,
              }"
            >
              <!-- add piece to square -->
              <div class="piece" v-if="board[row - 1][column - 1]">
                <!-- 
                    nuxt-img only applicable with ssr, this component is client only
                  <nuxt-img
                  preload
                  format="webp"
                  :width="piece_size"
                  :height="piece_size"
                  :src="board[row - 1][column - 1] + '.png'"
                /> -->
                <v-img
                  :src="get_piece_img_path(board[row - 1][column - 1])"
                ></v-img>
              </div>
            </div>
          </div>
        </div>
      </div>
    </v-col>
  </v-row>
</template>

<style lang="scss">
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
