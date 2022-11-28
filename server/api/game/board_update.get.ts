import GameHandler from "~~/server/utils/GameHandler";

export default defineEventHandler(async () => {
  const game = await GameHandler.get_instance();

  return game.get_board_update();
});
