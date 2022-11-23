import GameHandler from "~~/server/utils/GameHandler";
import { UserMove } from "~~/server/utils/types/Global";
import { verifyToken } from "~~/server/utils/jwt";
import DBConnector from "~~/server/utils/DBConnector";

export default defineEventHandler(async (event) => {
  // get basic auth header and authenticate user token
  const decoded = verifyToken(event.req.headers.authorization!);

  // validate authenitcation
  if (!decoded)
    return {
      statusCode: 401,
      status: "error",
      message: "Log in to make a move",
    };

  if (
    typeof decoded.id_user !== "number" ||
    decoded.id_user == undefined ||
    decoded.id_user == null
  )
    return { statusCode: 401, status: "error", message: "Invalid decoded JWT" };

  // get body from request
  const body = await readBody(event);

  // validate body
  if (!body) return { statusCode: 400, status: "error", message: "No body!" };
  if (!body.move)
    return { statusCode: 400, status: "error", message: "No move!" };

  const move: UserMove = body.move;

  // check if already voted
  const game = await GameHandler.get_instance();
  const check = game.has_user_voted(decoded.id_user);
  if (check)
    return {
      statusCode: 400,
      status: "error",
      message: `Already voted for ${move.san}`,
    };

  const db = await DBConnector.get_instance();
  const user = await db.get_user(decoded.id_user);
  if (!user) {
    // user does not exist in database
    // This might happen if the token is still valid
    // but the user was deleted from the database

    return {
      statusCode: 400,
      status: "error",
      message: `Failed to make a move!`,
    };
  }

  // check if move is valid
  const valid = await game.make_vote(user?.id_user, move);

  if (!valid)
    return { statusCode: 400, stauts: "error", message: "Invalid move" };

  return { status: "ok" };
});
