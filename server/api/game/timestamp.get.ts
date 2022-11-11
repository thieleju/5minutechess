import Game from "~~/server/utils/Game";

export default defineEventHandler(async () => {
  const game = await Game.get_instance();

  if (game) return game.timestamp_started;
  else return new Error("Game not ready yet!");
});
