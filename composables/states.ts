export const useInfoText = () => useState<string>("info_text", () => "");

export const useVoteUpdate = () => useFetch("/api/game/vote_update");
export const useBoardUpdate = () => useFetch("/api/game/board_update");

export const useStateUser = () => useState("state_user", () => null);

export const useDoLogin = async () => {
  const response = await $fetch("/api/auth/login");
  navigateTo(response.url, { external: true });
};
