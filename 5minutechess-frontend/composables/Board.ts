import Field from "./Field";
import Piece from "./Piece";

export default class Board {
  // create empty board with fields
  fields: Field[][] = this.initialize_board();
  fen_start: string = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";

  // create empty board with default fen
  constructor() {
    this.apply_fen_to_board(this.fen_start);
  }

  move(from: Field, to: Field) {
    // temporary print chess move notation
    console.log(`move: ${from.piece?.type}${from.notation}${to.notation}`);

    // replace piece on new field with piece on old field
    this.fields[to.x][to.y].piece = this.fields[from.x][from.y].piece;

    // remove piece from old field
    this.fields[from.x][from.y] = new Field(from.x, from.y);
  }

  get_field_by_notation(notation: string): Field {
    const y = notation.charCodeAt(0) - 97;
    const x = 8 - parseInt(notation[1]);
    return this.fields[x][y];
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

  get_fen_from_board(): string {
    let fen = "";
    for (let x = 0; x < 8; x++) {
      let empty = 0;
      for (let y = 0; y < 8; y++) {
        if (this.fields[x][y].piece) {
          if (empty) {
            fen += empty;
            empty = 0;
          }
          let piece = this.fields[x][y].piece;
          fen += piece?.white ? piece?.type.toUpperCase() : piece?.type;
        } else empty++;
      }
      if (empty) fen += empty;
      if (x < 7) fen += "/";
    }
    return fen;
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
