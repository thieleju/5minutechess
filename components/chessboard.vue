<script setup>
const info_text = useInfoText();
const state_user = useStateUser();
const vote_move_from = useVotedMoveFrom();
const vote_move_to = useVotedMoveTo();

const { data: votes, refresh: refresh_votes } = await useVoteUpdate();
const { data: board, refresh: refresh_board } = await useBoardUpdate();

const selected_piece = ref(null);

const who_to_move = computed(() => {
  const color = unref(board)?.turn === "w" ? "White" : "Black";
  return `${color} to move!`;
});

async function vote_for_move(move) {
  return $fetch("/api/game/vote_move", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${unref(state_user)?.jwt}`,
    },
    method: "POST",
    body: { move },
  });
}

function get_piece_on_square(x, y) {
  const square = get_square_from_xy(x, y);
  const board_setup = unref(board)?.board_setup;

  if (!board_setup) return null;
  var piece = null;
  board_setup.forEach((row) =>
    row.forEach((field) => (field?.square == square ? (piece = field) : null))
  );
  return piece;
}

function is_king_in_check_and_on_square(x, y) {
  // check if king is on square -> if not, return
  const piece = get_piece_on_square(x, y);
  if (!piece || !piece?.type) return false;
  if (piece?.type !== "k") return false;

  // If it's stupid, but it works, it's not stupid.
  // check if last moves san contains +
  const moves = unref(board)?.moves;
  if (!moves) return false;
  const last_move = moves[moves.length - 1];
  // check if the piece in last_move is the same as the piece on x, y
  if (last_move?.turn !== piece.color) return false;
  return last_move?.san.includes("+") || last_move?.san.includes("#");
}

function get_square_from_xy(x, y) {
  return `${["a", "b", "c", "d", "e", "f", "g", "h"][y]}${8 - x}`;
}

function is_voted_move(x, y) {
  const square = get_square_from_xy(x, y);
  // console.log(from, to);
  return square === vote_move_from.value || square === vote_move_to.value
    ? true
    : false;
}

function has_legal_moves(x, y) {
  const square = get_square_from_xy(x, y);
  return unref(board).legal_moves?.some((move) => move.from === square);
}

function is_legal_move(x, y) {
  const move = unref(board)?.legal_moves.find(
    (move) =>
      move.from == selected_piece.value?.square &&
      move.to == get_square_from_xy(x, y)
  );
  return move;
}

function is_piece_on_square(x, y) {
  const move = is_legal_move(x, y);
  return move?.captured;
}

function click_square(x, y) {
  // unselect piece if already selected
  if (
    selected_piece.value &&
    selected_piece.value.square == get_square_from_xy(x, y)
  ) {
    selected_piece.value = null;
    return;
  }

  // check if legal move was clicked
  const move = is_legal_move(x, y);
  if (move) {
    do_move(move);
    selected_piece.value = null;
    return;
  }

  // select other piece
  selected_piece.value = unref(board)?.board_setup[x][y];
}

async function do_move(move) {
  // check which legal move was made
  const legal_moves = unref(board).legal_moves;
  const legal_move = legal_moves.find(
    (m) => m.from == move.from && m.to == move.to
  );
  if (!legal_move) return;

  const response = await vote_for_move(legal_move);

  if (response.status === "error") {
    info_text.value = response.message;
    return;
  }

  // select voted move
  vote_move_from.value = legal_move.from;
  vote_move_to.value = legal_move.to;

  info_text.value = `You voted for the move ${move.san}`;

  await refresh_votes();
}

function get_piece_img(item) {
  if (!item) return;
  return `/pieces/${item.color}_${item.type}.png`;
}
</script>

<template>
  <div class="title">
    <v-icon class="my-auto" left>mdi-chess-queen</v-icon>
    <p class="titleText text-h6">5 Minute Chess - {{ who_to_move }}</p>
  </div>
  <!-- chessboard with 8x8 grid -->
  <div class="chessboard">
    <!-- loop through each row and column -->
    <div class="row" v-for="(row, y) in board?.board_setup" :key="row">
      <div class="column" v-for="(col, x) in board?.board_setup" :key="col">
        <!-- SQUARE -->
        <v-hover>
          <template v-slot:default="{ isHovering, props }">
            <div
              class="square drop-zone align-self-center"
              @click="click_square(x, y)"
              :class="{
                'white-square': (x + y) % 2 === 0,
                'black-square': (x + y) % 2 === 1,
                'piece-selected':
                  selected_piece?.square == get_square_from_xy(x, y) &&
                  has_legal_moves(x, y),
                'square-voted': is_voted_move(x, y),
              }"
            >
              <!-- Highlight legal moves for selected_piece -->
              <div
                v-if="is_legal_move(x, y) && !is_piece_on_square(x, y)"
                class="d-flex justify-center fill-height"
              >
                <div class="ma-auto piece-to-move"></div>
              </div>

              <!-- TODO annotate chess board from x and y coordinates -->
              <!-- <p class="v-btn--absolute text-black">
            {{ get_square_from_xy(x, y)[0] }}
          </p> -->

              <!-- add piece to square -->
              <div
                class="piece d-flex justify-center fill-height"
                v-if="board?.board_setup[x][y]"
              >
                <!-- PIECE -->
                <v-img
                  v-if="board?.board_setup[x][y]"
                  v-bind="props"
                  :src="get_piece_img(board?.board_setup[x][y])"
                  link
                  :class="{
                    'king-in-check vibrate-1': is_king_in_check_and_on_square(
                      x,
                      y
                    ),
                    'piece-hover': isHovering,
                  }"
                >
                  <div
                    :class="{
                      'piece-to-take': is_piece_on_square(x, y),
                    }"
                  ></div>
                </v-img>
              </div>
            </div>
          </template>
        </v-hover>
      </div>
    </div>
  </div>
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

.piece-to-move {
  background-color: #474747;
  border-radius: 50%;
  width: 25%;
  height: 25%;
  opacity: 0.5;
}

.piece-to-take {
  position: absolute;
  border: 5px solid #474747;
  border-radius: 50%;
  width: 100%;
  height: 100%;
  opacity: 0.15;
}

.piece-selected {
  border: 5px solid #47474759;
  width: 100%;
  height: 100%;
  opacity: 1;
}

.square-voted {
  border: 5px solid #75db8d93;
  width: 100%;
  height: 100%;
  opacity: 1;
}

.piece-hover {
  width: 100%;
  height: 100%;
  opacity: 1;
  transform: scale(0.97);
}

.king-in-check {
  background-color: #ff525288;
  width: 100%;
  height: 100%;
  opacity: 1;
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

.vibrate-1 {
  -webkit-animation: vibrate-1 0.3s linear infinite both;
  animation: vibrate-1 0.3s linear infinite both;
}

@-webkit-keyframes vibrate-1 {
  0% {
    -webkit-transform: translate(0);
    transform: translate(0);
  }
  20% {
    -webkit-transform: translate(-0.3px, 0.3px);
    transform: translate(-0.3px, 0.3px);
  }
  40% {
    -webkit-transform: translate(-0.3px, -0.3px);
    transform: translate(-0.3px, -0.3px);
  }
  60% {
    -webkit-transform: translate(0.3px, 0.3px);
    transform: translate(0.3px, 0.3px);
  }
  80% {
    -webkit-transform: translate(0.3px, -0.3px);
    transform: translate(0.3px, -0.3px);
  }
  100% {
    -webkit-transform: translate(0);
    transform: translate(0);
  }
}
@keyframes vibrate-1 {
  0% {
    -webkit-transform: translate(0);
    transform: translate(0);
  }
  20% {
    -webkit-transform: translate(-0.3px, 0.3px);
    transform: translate(-0.3px, 0.3px);
  }
  40% {
    -webkit-transform: translate(-0.3px, -0.3px);
    transform: translate(-0.3px, -0.3px);
  }
  60% {
    -webkit-transform: translate(0.3px, 0.3px);
    transform: translate(0.3px, 0.3px);
  }
  80% {
    -webkit-transform: translate(0.3px, -0.3px);
    transform: translate(0.3px, -0.3px);
  }
  100% {
    -webkit-transform: translate(0);
    transform: translate(0);
  }
}
</style>
