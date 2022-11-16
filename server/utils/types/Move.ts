export type Move = {
  san: string;
  move_nr: number;
  vote_count: number;
  users: string[];
  timestamp: number;
  turn: "w" | "b";
  promotion?: string;
};
