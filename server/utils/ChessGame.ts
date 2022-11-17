import { Chess } from "chess.js";
import { Move } from "./types/Move";
import DBConnector from "./DBConnector";

// Flags
// n - a non-capture
// b - a pawn push of two squares
// e - an en passant capture
// c - a standard capture
// p - a promotion
// k - kingside castling
// q - queenside castling

export default class ChessGame {
  fen_default: string =
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

  chess: Chess = new Chess();
  moves: Move[] = [];

  static instance: ChessGame;

  static async get_instance(): Promise<ChessGame> {
    if (!this.instance) {
      // create new chessgame instance
      this.instance = new ChessGame();

      // read from storage
      const db = await DBConnector.get_instance();
      const game = await db.get_game_current();

      // load moves
      this.instance.moves = game.moves;

      // load stored fen
      if (game?.fen) this.instance.load_fen(game.fen);
      else this.instance.load_fen(this.instance.fen_default);
    }
    return this.instance;
  }

  constructor() {
    console.log("New chess game instance created");
  }

  load_fen(fen: string) {
    const valid = this.chess.load(fen);
    if (!valid) console.log("Invalid fen: " + fen);
  }

  get_legal_moves() {
    return this.chess.moves({ verbose: true });
  }

  is_move_valid(san: string) {
    const temp = new Chess();

    temp.load(this.get_fen());

    return temp.move(san) ? true : false;
  }

  async make_move(move: Move) {
    // make move
    const chess_move = this.chess.move(move.san);

    // check if move is valid
    if (!chess_move) return false;
    console.log("Move made: " + move.san, this.get_board_update().fen);

    // add move to moves array
    this.moves.push(move);

    return true;
  }

  get_board_update() {
    return {
      fen: this.get_fen(),
      moves: this.moves,
      turn: this.chess.turn(), // 'w' | 'b'
      legal_moves: this.get_legal_moves(),
      board_setup: this.chess.board(),
      game_result: this.get_game_result(),
    };
  }

  get_game_result():
    | "checkmate"
    | "stalemate"
    | "insufficient material"
    | "threefold repetition"
    | "50 move rule"
    | null {
    if (this.chess.isCheckmate()) return "checkmate";
    if (this.chess.isStalemate()) return "stalemate";
    if (this.chess.isInsufficientMaterial()) return "insufficient material";
    if (this.chess.isThreefoldRepetition()) return "threefold repetition";
    if (!this.chess.isInsufficientMaterial && this.chess.isDraw())
      return "50 move rule";
    else return null;
  }

  is_game_over() {
    return this.chess.isGameOver();
  }

  get_fen() {
    return this.chess.fen();
  }

  get_move_count() {
    return this.chess.history().length;
  }

  get_turn() {
    return this.chess.turn();
  }

  reset_game() {
    this.moves = [];
    this.chess.reset();
    this.load_fen(this.fen_default);
  }

  get_png(newline?: string, maxWidth?: number) {
    return this.chess.pgn({ newline, maxWidth });
  }
}
