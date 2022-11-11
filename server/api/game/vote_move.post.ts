import Game from "~~/server/utils/Game";

export default defineEventHandler(async (event) => {
  const game = await Game.get_instance();

  if (!game) return new Error("Game not ready yet!");

  // add vote to game
  // TODO get auth user from request
  const user = "user" + Math.floor(Math.random() * 1000);

  // get body from request
  const body = await readBody(event);
  const move = body.move;

  await game.add_vote(user, move);

  return { status: "ok" };
});
