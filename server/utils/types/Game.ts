import { Move } from "./Move";
import { Vote } from "./Vote";

export type Game = {
  id_game: number;
  timestamp_started: number;
  timestamp_next: number;
  fen: string;
  fen_started: string;
  pgn: string;
  result: string | null;
  votes: Vote[];
  votes_history: Vote[];
  moves: Move[];
};
