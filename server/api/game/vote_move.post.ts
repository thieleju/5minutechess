import GameHandler from "~~/server/utils/GameHandler";

export default defineEventHandler(async (event) => {
  // add vote to game
  // TODO get auth user from request
  const user = "user" + Math.floor(Math.random() * 1000);

  // get body from request
  const body = await readBody(event);

  if (!body) return { status: 400, body: "No body!" };
  if (!body.move) return { status: 400, body: "No move!" };

  // check if move is valid
  const game = await GameHandler.get_instance();
  const valid = await game.make_vote(user, body.move);
  // throw createError({
  //   statusCode: 400,
  //   message: "Invalid move",
  //   stack: undefined,
  // });

  if (!valid) return { stauts: "error", message: "Invalid move" };

  return { status: "ok" };
});
