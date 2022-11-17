import ChessGame from "./ChessGame";
import { Vote } from "./types/Vote";
import { Move } from "./types/Move";
import { UserMove } from "./types/UserMove";
import DBConnector from "./DBConnector";

export default class GameHandler {
  GAME_TICK_RATE: number = 1000;
  GAME_INVERVAL: NodeJS.Timer | undefined;

  id_game: number = 0;
  timestamp_started: number = 0;
  timestamp_next: number = 0;
  running: boolean = false;
  pause: boolean = false;

  votes: Vote[] = [];
  votes_history: Vote[] = [];

  static instance: GameHandler;

  static async get_instance(): Promise<GameHandler> {
    if (!this.instance) this.instance = new GameHandler();
    return this.instance;
  }

  constructor() {
    // Initialize ChessGame
    ChessGame.get_instance();

    // start game loop
    this.timestamp_started = new Date().getTime();
    this.start_game_loop();

    console.log("New game handler instance created");
  }

  start_game_loop() {
    this.GAME_INVERVAL = setInterval(
      async () => await this.game_tick(),
      this.GAME_TICK_RATE
    );
    console.log(`Game loop running with tick rate ${this.GAME_TICK_RATE}ms`);
  }

  stop_game_loop() {
    console.log(`Game loop stopped`);
    clearInterval(this.GAME_INVERVAL);
  }

  async game_tick() {
    if (!this.running) {
      // check if start new game or continue saved game
      const db = await DBConnector.get_instance();
      const game = await db.get_game_current();
      if (game) await this.continue_saved_game();
      else await this.start_new_game();

      this.running = true;
    }

    // skip tick if paused
    if (this.pause) return;

    // check if time is up, no -> skip, yes -> new move
    if (new Date().getTime() < this.timestamp_next) return;

    // skip if no votes
    if (this.votes.length == 0) {
      // reset timestamp
      this.timestamp_next = this.get_next_timestamp();

      // save timestamp
      const db = await DBConnector.get_instance();
      db.save_timestamp_next(this.timestamp_next);
      return;
    }

    // find most voted move
    const most_voted_move = this.find_most_voted_move();
    if (!most_voted_move) console.log("Error, No most voted move found");

    // make move
    const game = await ChessGame.get_instance();
    const move = game.make_move(most_voted_move!);
    if (!move) console.log("Error, Invalid move", move);

    // save move to db
    const db = await DBConnector.get_instance();
    await db.save_move(most_voted_move!);
    await db.save_fen(game.get_fen());

    // check if game is over
    if (game.is_game_over()) {
      // get game result and print it
      const result = await this.get_game_result();
      this.pause = true;

      // save finished game
      this.save_game_finished();

      // wait 5 seconds // TODO change this
      setTimeout(async () => await this.start_new_game(), 5000);

      console.log(`Game ${this.id_game} over: ${result}`);
    } else {
      // reset votes and timestamp
      this.timestamp_next = this.get_next_timestamp();

      // save timestamp
      const db = await DBConnector.get_instance();
      db.save_timestamp_next(this.timestamp_next);

      this.votes = [];
    }
  }

  async save_game_finished() {
    const chess = await ChessGame.get_instance();
    const db = await DBConnector.get_instance();
    const game = {
      id_game: this.id_game,
      timestamp_started: this.timestamp_started,
      timestamp_next: this.timestamp_next,
      fen: chess.get_fen(),
      fen_started: chess.fen_default,
      pgn: chess.get_png(),
      result: chess.get_game_result(),
      votes: this.votes,
      votes_history: this.votes_history,
      moves: chess.moves,
    };
    db.save_game_fnished(game);
  }

  async continue_saved_game() {
    const db = await DBConnector.get_instance();
    const game = await db.get_game_current();
    this.id_game = game.id_game;
    this.timestamp_next = game.timestamp_next;
    this.timestamp_started = game.timestamp_started;
    this.votes = this.votes;
    this.votes_history = this.votes_history;

    console.log(`Continued game: ${this.id_game}`);
  }

  async start_new_game() {
    // reset everything and start new game
    this.id_game++;
    this.timestamp_started = new Date().getTime();
    this.timestamp_next = this.get_next_timestamp();
    this.votes = [];
    // reset chess game
    const chess = await ChessGame.get_instance();
    chess.reset_game();

    this.pause = false;

    // save new current game to storage
    const db = await DBConnector.get_instance();
    const game = {
      id_game: this.id_game,
      timestamp_started: this.timestamp_started,
      timestamp_next: this.timestamp_next,
      fen: chess.get_fen(),
      fen_started: chess.fen_default,
      pgn: chess.get_png(),
      result: chess.get_game_result(),
      votes: this.votes,
      votes_history: this.votes_history,
      moves: chess.moves,
    };
    db.save_game_current(game);

    console.log(`New game started: ${this.id_game}`);
  }

  async make_vote(user: string, move: UserMove): Promise<boolean> {
    // check if move is valid
    const chess = await ChessGame.get_instance();
    if (!chess.is_move_valid(move.san)) return false;

    // add new vote to array
    const vote = {
      id_game: this.id_game,
      id_vote: this.votes.length,
      move_nr: chess.get_move_count(),
      san: move.san,
      from: move.from,
      to: move.to,
      user,
      timestamp: new Date().getTime(),
      turn: chess.get_turn(),
      piece: move.piece,
      flags: move.flags,
    };
    this.votes.push(vote);

    // save vote to db
    const db = await DBConnector.get_instance();
    db.save_vote_history(vote);

    console.log(
      `[${new Date().toISOString()}] ${user} voted for move: ${move.san}`
    );
    return true;
  }

  async get_game_result(): Promise<string | null> {
    const chess = await ChessGame.get_instance();
    return chess.get_game_result();
  }

  async get_game_update() {
    const chess_game = await ChessGame.get_instance();
    return {
      id_game: this.id_game,
      timestamp_started: this.timestamp_started,
      timestamp_next: this.timestamp_next,
      votes: this.votes,
      moves: chess_game.moves,
      game_result: chess_game.get_game_result(),
    };
  }

  get_next_timestamp(): number {
    // get timestamp when minute is modulo 5 in the future
    // e.g. 5:00, 5:05, 5:10, 5:15, ...
    const date = new Date();

    // if in development mode, reduce time to 20 seconds
    if (process.env.NODE_ENV == "development") return date.getTime() + 20000;

    const timestamp =
      date.getTime() +
      (5 - (date.getUTCMinutes() % 5)) * 60 * 1000 -
      date.getUTCSeconds() * 1000 -
      date.getUTCMilliseconds();
    return timestamp;
  }

  has_user_voted(user: string): undefined | Vote {
    return this.votes.find((vote) => vote.user == user);
  }

  find_most_voted_move(): Move | undefined {
    // loop through votes and count votes for each move
    var counted: Array<Move> = [];
    this.votes.forEach((vote: Vote) => {
      const new_move = {
        move_nr: vote.move_nr,
        san: vote.san,
        from: vote.from,
        to: vote.to,
        vote_count: 1,
        users: [vote.user],
        timestamp: vote.timestamp,
        turn: vote.turn,
        piece: vote.piece,
        flags: vote.flags,
      };
      // find
      let found = counted.find((c) => c.san == vote.san);
      if (found) {
        found.vote_count++;
        found.users = [...found.users, vote.user];
      } else counted.push(new_move);
    });
    // find most voted move in array and return it
    return counted.find(
      (v) => v.vote_count == Math.max(...counted.map((v) => v.vote_count))
    );
  }
}
