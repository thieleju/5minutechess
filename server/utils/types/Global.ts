// Flags
// n - a non-capture
// b - a pawn push of two squares
// e - an en passant capture
// c - a standard capture
// p - a promotion
// k - kingside castling
// q - queenside castling

export type Game = {
  id_game: number;
  timestamp_started: number;
  timestamp_next: number;
  fen: string;
  fen_started: string;
  pgn: string;
  result: string | null;
};

export type Move = {
  id_move: number;
  id_game: number;
  move_nr: number;
  san: string;
  from: string;
  to: string;
  vote_count: number;
  timestamp: number;
  turn: "w" | "b";
  piece: "p" | "r" | "k" | "n" | "q" | "b";
  flags: "n" | "b" | "e" | "c" | "p" | "k" | "q";
  id_users: number[];
};

export type Vote = {
  id_vote: number;
  id_game: number;
  display_name?: string;
  move_nr: number;
  san: string;
  from: string;
  to: string;
  id_user: number;
  timestamp: number;
  turn: "w" | "b";
  piece: "p" | "r" | "k" | "n" | "q" | "b";
  flags: "n" | "b" | "e" | "c" | "p" | "k" | "q";
};

export type UserMove = {
  san: string;
  from: string;
  to: string;
  color: "w" | "b";
  flags: "n" | "b" | "e" | "c" | "p" | "k" | "q";
  piece: "p" | "r" | "k" | "n" | "q" | "b";
};

export type Stats = {
  games_played_in: number;
  votes_count: number;
  captures: number;
  en_passant: number;
  promotion: number;
  castle: number;
  checks: number;
  checkmates: number;
  moved_pieces: {
    pawn: number;
    knight: number;
    bishop: number;
    rook: number;
    queen: number;
    king: number;
  };
};

export type User = {
  id_user: number;
  display_name: string;
  visibility: "public" | "private";
  stats: Stats;
  auth: {
    lichess: {
      id: number | string;
      username: string;
      visibility: "private" | "public";
    } | null;
    discord: {
      id: number | string;
      username: string;
      visibility: "private" | "public";
    } | null;
    github: {
      id: number | string;
      username: string;
      visibility: "private" | "public";
    } | null;
  };
};
