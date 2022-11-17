export type UserMove = {
  color: "w" | "b";
  flags: string;
  piece: string;
  san: string;
  from: string;
  to: string;
};

// Flags
// n - a non-capture
// b - a pawn push of two squares
// e - an en passant capture
// c - a standard capture
// p - a promotion
// k - kingside castling
// q - queenside castling
