export const useVotedMove = () => useState<string>("voted_move", () => "");

export const useVoteUpdate = () => useFetch("/api/game/vote_update");
export const useBoardUpdate = () => useFetch("/api/game/board_update");

export const useStateUser = () => useState("state_user", () => null);
export const useStateAccessToken = () =>
  useState("state_access_token", () => null);
export const useStateJWT = () => useState("state_JWT", () => null);
