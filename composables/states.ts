export const useInfoText = () => useState<string>("info_text", () => "");

export const useVoteUpdate = () => useFetch("/api/game/vote_update");
export const useBoardUpdate = () => useFetch("/api/game/board_update");

export const useStateUser = () => useState("state_user", () => null);

export const useDoLoginGithub = async () => {
  const response = (await $fetch(`/api/auth/github/login`)) as any;
  navigateTo(response.url, { external: true });
};

export const useDoLoginDiscord = async () => {
  const response = (await $fetch(`/api/auth/discord/login`)) as any;
  navigateTo(response.url, { external: true });
};

export const useDoLoginLichess = async () => {
  const response = (await $fetch(`/api/auth/lichess/login`)) as any;
  navigateTo(response.url, { external: true });
};

export const useVotedMoveFrom = () =>
  useState<string>("voted_move_from", () => "");
export const useVotedMoveTo = () => useState<string>("voted_move_to", () => "");
