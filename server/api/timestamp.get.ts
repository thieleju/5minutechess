export default defineEventHandler(() => {
  // get current time
  const date = new Date();
  const minutes = date.getUTCMinutes();
  const seconds = date.getUTCSeconds();

  // get timestamp when minute is modulo 5 in the future
  // e.g. 5:00, 5:05, 5:10, 5:15, ...
  const timestamp =
    date.getTime() +
    (5 - (minutes % 5)) * 60 * 1000 -
    seconds * 1000 -
    date.getUTCMilliseconds();

  return { timestamp };
});
