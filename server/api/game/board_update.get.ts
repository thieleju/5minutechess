import ChessGame from "~~/server/utils/ChessGame";

export default defineEventHandler(async () => {
  const game = await ChessGame.get_instance();

  return game.get_board_update();
});
