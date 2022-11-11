export default defineEventHandler(async () => {
  try {
    // read data from storage
    const game_current = await useStorage().getItem("db:game_current.json");

    return game_current.moves;
  } catch (error) {
    console.error(error);
    return { status: "error" };
  }
});
