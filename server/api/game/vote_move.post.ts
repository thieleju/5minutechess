import GameHandler from "~~/server/utils/GameHandler";

import { verifyToken } from "~~/server/utils/verify_token";

export default defineEventHandler(async (event) => {
  // get basic auth header and authenticate user token
  const user = verifyToken(event.req.headers.authorization!);

  // validate authenitcation
  if (!user)
    return {
      statusCode: 401,
      status: "error",
      message: "Unauthorized, please log in first!",
    };
  if (!user.username)
    return { statusCode: 401, status: "error", message: "Invalid decoded JWT" };

  // get body from request
  const body = await readBody(event);

  // validate body
  if (!body) return { statusCode: 400, status: "error", message: "No body!" };
  if (!body.move)
    return { statusCode: 400, status: "error", message: "No move!" };

  // check if already voted
  const game = await GameHandler.get_instance();
  const move = game.has_user_voted(user.username);
  if (move)
    return {
      statusCode: 400,
      status: "error",
      message: `Already voted for ${move.san}`,
    };

  // check if move is valid
  const valid = await game.make_vote(user?.username, body.move);

  if (!valid)
    return { statusCode: 400, stauts: "error", message: "Invalid move" };

  return { status: "ok" };
});
