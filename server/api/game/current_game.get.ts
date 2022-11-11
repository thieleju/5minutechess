import Game from "~~/server/utils/Game";

export default defineEventHandler(async () => {
  const game = await Game.get_instance();

  // console.log("request to current game", game ? "yes" : "no");

  return game || new Error("Game not ready yet!");
});
