import GameHandler from "~~/server/utils/GameHandler";

export default defineEventHandler(async () => {
  const game = await GameHandler.get_instance();

  return await game.get_game_update();
});
