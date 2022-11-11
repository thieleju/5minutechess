import Game from "~~/server/utils/Game";

export default defineEventHandler(async () => {
  const game = await Game.get_instance();

  if (game) return game.moves;
  else return new Error("Game not ready yet!");
});
