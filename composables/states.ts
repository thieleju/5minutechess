export const useInfoText = () => useState<string>("infotext", () => "");
export const useGameResult = () => useState<string>("gameresult", () => "");

// export const useVoteUpdate = () =>
//   useState("voteupdate", () => $fetch("/api/game/vote_update"));

export const useVoteUpdate = () => useFetch("/api/game/vote_update");

export const useBoardUpdate = () => useFetch("/api/game/board_update");
