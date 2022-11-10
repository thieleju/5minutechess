import Field from "./Field";
import Piece from "./Piece";

export default class Board {
  // create empty board with fields
  fields: Field[][] = this.initialize_board();
  fen_start: string = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";

  constructor() {
    // create empty board with default fen
    this.apply_fen_to_board(this.fen_start);
    console.log(this.fields);
  }

  // get empty 2d chessboard array with notation
  initialize_board(): Field[][] {
    const board: Field[][] = new Array(8)
      .fill(null)
      .map(() => new Array(8).fill(new Field(0, 0)));
    for (let x = 0; x < 8; x++) {
      for (let y = 0; y < 8; y++) {
        board[x][y] = new Field(x, y);
      }
    }
    return board;
  }

  apply_fen_to_board(fen: string) {
    // split fen into rows
    const rows: Array<string> = fen.split("/");
    rows.forEach((row, row_index) => {
      let col_index = 0;
      for (let i = 0; i < row.length; i++) {
        const char = row[i];
        // if char is not a number, it is a piece
        if (isNaN(parseInt(char))) {
          let isWhite = char === char.toUpperCase();
          this.fields[row_index][col_index].piece = new Piece(
            isWhite,
            char.toLowerCase() as "p" | "r" | "n" | "b" | "q" | "k"
          );

          // next column
          col_index++;
        } else {
          // if char is a number, skip that many columns
          col_index += parseInt(char);
        }
      }
    });
  }

  toString() {
    let string = "";
    for (let x = 0; x < 8; x++) {
      for (let y = 0; y < 8; y++) {
        string += this.fields[x][y].piece?.toString() || " ";
      }
      string += "\n";
    }
    return string;
  }
}
