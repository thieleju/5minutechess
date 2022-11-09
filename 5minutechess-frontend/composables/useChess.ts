export default function () {
  // return default fen board
  const default_board = () => {
    const fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";
    return fen_to_board(fen);
  };

  // convert fen string to 2d array of pieces
  const fen_to_board = (fen: any) => {
    const board: Array<Array<string>> = [];
    const rows = fen.split("/");

    // parse each row into an array of pieces
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const row_array = [];

      // parse each piece in the row
      for (let j = 0; j < row.length; j++) {
        const char = row[j];

        if (char === " ") break;

        // if char is not a number, it is a piece
        // modify string to include color of piece
        // or add empty string if char is a number
        if (isNaN(char))
          if (char === char.toUpperCase())
            row_array.push(`w_${char.toLowerCase()}`);
          else row_array.push(`b_${char.toLowerCase()}`);
        else
          for (let k = 0; k < parseInt(char); k++) {
            row_array.push("");
          }
      }
      board.push(row_array);
    }

    return board;
  };

  return { default_board, fen_to_board };
}
