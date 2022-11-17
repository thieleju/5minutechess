export type Vote = {
  id_game: number;
  id_vote: number;
  user: string;
  timestamp: number;
  move_nr: number;
  san: string;
  turn: "w" | "b";
  piece: string;
  flags: string;
};
