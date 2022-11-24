import StatsHandler from "~~/server/utils/StatsHandler";

export default defineEventHandler(async () => {
  const stats = await StatsHandler.get_instance();
  const leaderboard_data = await stats.get_stats_leaderboard();

  return leaderboard_data;
});
