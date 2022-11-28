import { Chess } from "chess.js";
import { Move, Vote, UserMove, User } from "./types/Global";
import DBConnector from "./DBConnector";
import StatsHandler from "./StatsHandler";

// Flags
// n - a non-capture
// b - a pawn push of two squares
// e - an en passant capture
// c - a standard capture
// p - a promotion
// k - kingside castling
// q - queenside castling

export default class ChessGame {
  fen_started: string =
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

  chess: Chess = new Chess();

  static instance: ChessGame;

  static async get_instance(): Promise<ChessGame> {
    if (!this.instance) this.instance = new ChessGame();
    return this.instance;
  }

  constructor() {
    console.log("New ChessGame instance created");
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

  make_move(move: Move): false | UserMove {
    // make move
    const chess_move = this.chess.move(move.san);

    // check if move is valid
    if (!chess_move) return false;
    console.log("Move made: " + move.san, this.get_fen());

    return chess_move as UserMove;
  }

  get_game_result():
    | "checkmate"
    | "stalemate"
    | "insufficient material"
    | "threefold repetition"
    | "50 move rule"
    | "" {
    if (this.chess.isCheckmate()) return "checkmate";
    if (this.chess.isStalemate()) return "stalemate";
    if (this.chess.isInsufficientMaterial()) return "insufficient material";
    if (this.chess.isThreefoldRepetition()) return "threefold repetition";
    if (!this.chess.isInsufficientMaterial && this.chess.isDraw())
      return "50 move rule";
    else return "";
  }

  is_game_over() {
    return this.chess.isGameOver();
  }

  get_fen() {
    return this.chess.fen();
  }

  get_move_count() {
    console.log("Move count: " + this.chess.history().length);
    return this.chess.history().length;
  }

  get_turn(): "w" | "b" {
    return this.chess.turn();
  }

  get_board() {
    return this.chess.board();
  }

  reset_game() {
    this.chess.reset();
    this.load_fen(this.fen_started);
  }

  get_png(newline?: string, maxWidth?: number) {
    return this.chess.pgn({ newline, maxWidth });
  }
}
