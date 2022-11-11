export default defineEventHandler(async (event) => {
  // get body from request
  const body = await readBody(event);

  // get game from nuxt instance
  const { $game } = useNuxtApp();

  // add vote to game
  // TODO get auth user from request
  const user = "user" + Math.floor(Math.random() * 1000);
  const move = body.move;
  await $game.add_vote(user, move);

  return { status: "ok" };
});
