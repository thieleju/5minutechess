export type Vote = {
  id_game: number;
  id_vote: number;
  move_nr: number;
  san: string;
  from: string;
  to: string;
  user: string;
  timestamp: number;
  turn: "w" | "b";
  piece: string;
  flags: string;
};

// Flags
// n - a non-capture
// b - a pawn push of two squares
// e - an en passant capture
// c - a standard capture
// p - a promotion
// k - kingside castling
// q - queenside castling
