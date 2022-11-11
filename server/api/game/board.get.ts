import Board from "~~/server/utils/Board";

export default defineEventHandler(async () => {
  const board = await Board.get_instance();

  // console.log("request to board", board ? "yes" : "no");

  return board || new Error("Board not ready yet!");
});
