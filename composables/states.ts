export const useVotedMove = () => useState<string>("voted_move", () => "");

export const useVoteUpdate = () => useFetch("/api/game/vote_update");
export const useBoardUpdate = () => useFetch("/api/game/board_update");
