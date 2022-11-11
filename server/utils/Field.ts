import Piece from "./Piece";

export default class Field {
  x: number = 0;
  y: number = 0;
  piece: Piece | null = null;
  notation: string = "";

  constructor(x: number, y: number, piece?: Piece | null) {
    this.x = x;
    this.y = y;
    // get chessnotation string for field
    this.notation = String.fromCharCode(97 + y) + (8 - x);
    // if piece is given, set it
    if (piece) this.piece = piece;
  }
}
