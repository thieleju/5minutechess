import Game from "~~/server/utils/Game";

export default defineEventHandler(async () => {
  const game = await Game.get_instance();

  return game || new Error("Game not ready yet!");
});
