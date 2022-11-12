import Board from "~~/server/utils/Board";
import Game from "~~/server/utils/Game";

export default defineEventHandler(async (event) => {
  const game = await Game.get_instance();

  if (!game) return null;

  // add vote to game
  // TODO get auth user from request
  const user = "user" + Math.floor(Math.random() * 1000);

  // get body from request
  const body = await readBody(event);

  // check if move is valid
  const board = await Board.get_instance();
  const valid = await board.check_if_move_is_valid(body.move);
  // throw createError({
  //   statusCode: 400,
  //   message: "Invalid move",
  //   stack: undefined,
  // });

  if (!valid) return { stauts: "error", message: "Invalid move" };

  await game.add_vote(user, body.move);

  return { status: "ok" };
});
