import ChessGame from "./ChessGame";
import { Vote } from "./types/Vote";
import { Move } from "./types/Move";
import { Chess } from "chess.js";

export default class GameHandler {
  //
  GAME_DB_ITEM: string = "db:game_current.json";
  GAME_TICK_RATE: number = 1000;
  GAME_INVERVAL: NodeJS.Timer | undefined;

  id_game: number = 1;
  timestamp_started: number = 0;
  timestamp_next: number = 0;

  votes: Vote[] = [];

  static instance: GameHandler;

  static async get_instance() {
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
    console.log(
      "game tick, votes:",
      this.votes.length,
      "timer:",
      new Date(this.timestamp_next).toLocaleTimeString(),
      "server time:",
      new Date().toLocaleTimeString(),
      new Date().getTime() < this.timestamp_next
    );
    // check if time is up, no -> skip, yes -> new move
    if (new Date().getTime() < this.timestamp_next) return;

    // skip if no votes
    if (this.votes.length == 0) {
      // reset timestamp
      this.timestamp_next = this.get_next_timestamp();
      // TODO save to storage
      // this.save_game();
      return;
    }

    // find most voted move
    const most_voted_move = this.find_most_voted_move();
    if (!most_voted_move) console.log("Error, No most voted move found");

    // make move
    const game = await ChessGame.get_instance();
    const move = game.make_move(most_voted_move!);
    if (!move) console.log("Error, Invalid move", move);

    // check if game is over
    if (game.is_game_over()) {
      // get game result and print it
      const result = await this.get_game_result();
      console.log(`Game ${this.id_game} over: ${result}`);
      // TODO save to storage
      await this.start_new_game();
      return;
    }

    // reset votes and timestamp
    this.timestamp_next = this.get_next_timestamp();
    this.votes = [];
  }

  async start_new_game() {
    // reset everything and start new game
    this.id_game++;
    this.timestamp_started = new Date().getTime();
    this.timestamp_next = this.get_next_timestamp();
    this.votes = [];
    // reset chess game
    const chess_game = await ChessGame.get_instance();
    chess_game.reset_game();

    // TODO save to storage

    console.log(`New game started: ${this.id_game}`);
  }

  async get_game_result(): Promise<string | null> {
    const chess = await ChessGame.get_instance();
    return chess.get_game_result();
  }

  async make_vote(user: string, move: any): Promise<boolean> {
    // check if move is valid
    const chess = await ChessGame.get_instance();
    if (!chess.is_move_valid(move.san)) return false;

    const timestamp = new Date().getTime();

    // add new vote to array
    this.votes.push({
      id_game: this.id_game,
      id_vote: this.votes.length,
      user,
      timestamp,
      move_nr: chess.get_move_count(),
      san: move.san,
    });
    console.log(
      `[${new Date(timestamp).toISOString()}] ${user} voted for move: ${
        move.san
      }`
    );
    return true;
  }

  async get_game_update() {
    const chess_game = await ChessGame.get_instance();
    return {
      id_game: this.id_game,
      timestamp_started: this.timestamp_started,
      timestamp_next: this.timestamp_next,
      votes: this.votes,
      moves: chess_game.moves,
    };
  }

  get_next_timestamp(): number {
    // get timestamp when minute is modulo 5 in the future
    // e.g. 5:00, 5:05, 5:10, 5:15, ...
    const date = new Date();

    // if in development mode, reduce time to 10 seconds
    if (process.env.NODE_ENV == "development") return date.getTime() + 20000;

    const timestamp =
      date.getTime() +
      (5 - (date.getUTCMinutes() % 5)) * 60 * 1000 -
      date.getUTCSeconds() * 1000 -
      date.getUTCMilliseconds();
    return timestamp;
  }

  find_most_voted_move(): Move | undefined {
    // loop through votes and count votes for each move
    var counted: Array<Move> = [];
    this.votes.forEach((vote: Vote) => {
      let found = counted.find((c) => c.san == vote.san);
      if (found) {
        found.vote_count++;
        found.users = [...found.users, vote.user];
      } else
        counted.push({
          san: vote.san,
          vote_count: 1,
          move_nr: vote.move_nr,
          users: [vote.user],
          timestamp: vote.timestamp,
        });
    });
    // find most voted move in array and return it
    return counted.find(
      (v) => v.vote_count == Math.max(...counted.map((v) => v.vote_count))
    );
  }
}
