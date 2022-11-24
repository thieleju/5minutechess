import ChessGame from "./ChessGame";
import DBConnector from "./DBConnector";
import { Move, Vote, UserMove } from "./types/Global";
import StatsHandler from "./StatsHandler";

export default class GameHandler {
  GAME_TICK_RATE: number = 1000;
  GAME_INVERVAL: NodeJS.Timer | undefined;

  id_game: number = 0;
  timestamp_started: number = 0;
  timestamp_next: number = 0;
  running: boolean = false;
  pause: boolean = false;

  votes: Vote[] = [];

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

    console.log("New GameHandler instance created");
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
    const db = await DBConnector.get_instance();

    if (!this.running) {
      // check if start new game or continue saved game
      const db = await DBConnector.get_instance();
      const game = await db.get_game();
      if (game) await this.continue_saved_game();
      else await this.start_new_game();

      this.running = true;
    }

    // skip tick if paused
    if (this.pause) return;

    // check if time is up, no -> skip, yes -> new move
    if (new Date().getTime() < this.timestamp_next) return;

    // skip if no votes
    if (!this.votes || this.votes.length == 0) {
      // reset timestamp
      this.timestamp_next = this.get_next_timestamp();

      // save timestamp
      db.save_timestamp_next(this.timestamp_next);
      return;
    }

    // find most voted move
    const most_voted_move = await this.find_most_voted_move();

    // make move
    const chess_game = await ChessGame.get_instance();
    const move: UserMove | false = chess_game.make_move(most_voted_move);
    if (!move) console.log("Error, Invalid move", move);

    // update stats
    const stats = await StatsHandler.get_instance();
    var promises = [];
    for (const user of most_voted_move.id_users) {
      promises.push(stats.update_move_stats(user, move!));
    }
    await Promise.all(promises);

    // save move to db
    await db.save_move(most_voted_move);
    await db.save_fen(chess_game.get_fen());

    // check if game is over
    if (chess_game.is_game_over()) {
      // get game result and print it
      const result = await this.get_game_result();
      this.pause = true;

      // save finished game
      db.save_game_finshed(
        {
          id_game: this.id_game,
          timestamp_started: this.timestamp_started,
          timestamp_next: this.timestamp_next,
          fen: chess_game.get_fen(),
          fen_started: chess_game.fen_started,
          pgn: chess_game.get_png(),
          result: chess_game.get_game_result(),
        },
        chess_game.moves,
        this.votes
      );

      // wait 5 seconds // TODO change this
      setTimeout(async () => await this.start_new_game(), 5000);

      console.log(`Game ${this.id_game} over: ${result}`);
    } else {
      // reset votes and timestamp
      this.timestamp_next = this.get_next_timestamp();

      // save timestamp
      db.save_timestamp_next(this.timestamp_next);

      this.votes = [];
      return;
    }
  }

  async find_most_voted_move(): Promise<Move> {
    const chess_game = await ChessGame.get_instance();

    // count votes and save info in counted_votes
    const counted_votes: Array<Move> = [];
    this.votes.forEach((vote) => {
      const found = counted_votes.find((v) => v.san == vote.san);
      if (found) {
        found.vote_count++;
        found.id_users.push(vote.id_user);
      } else {
        const id_users: number[] = [];
        counted_votes.push(chess_game.generate_move_from_vote(vote));
      }
    });

    // find most voted san
    var most_voted: Move = counted_votes[0];
    counted_votes.forEach((move) => {
      if (move.vote_count > most_voted.vote_count) most_voted = move;
    });

    return most_voted;
  }

  async continue_saved_game() {
    const db = await DBConnector.get_instance();
    const game = await db.get_game();
    this.id_game = game.id_game;
    this.timestamp_next = game.timestamp_next;
    this.timestamp_started = game.timestamp_started;
    this.votes = await db.get_votes();

    console.log(`Continued game: ${this.id_game}`);
  }

  async start_new_game() {
    // reset everything and start new game
    this.id_game++;
    this.timestamp_started = new Date().getTime();
    this.timestamp_next = this.get_next_timestamp();
    this.votes = [];
    this.pause = false;

    // reset chess game
    const chess_game = await ChessGame.get_instance();
    chess_game.reset_game();

    // save new current game to storage
    const db = await DBConnector.get_instance();
    db.save_game_current({
      id_game: this.id_game,
      timestamp_started: this.timestamp_started,
      timestamp_next: this.timestamp_next,
      fen: chess_game.get_fen(),
      fen_started: chess_game.fen_started,
      pgn: chess_game.get_png(),
      result: "",
    });

    console.log(`New game started: ${this.id_game}`);
  }

  async make_vote(id_user: number, move: UserMove): Promise<boolean> {
    // check if move is valid
    const chess = await ChessGame.get_instance();
    if (!chess.is_move_valid(move.san)) return false;

    // add new vote to array
    const vote = {
      id_vote: this.votes.length,
      id_game: this.id_game,
      move_nr: chess.get_move_count(),
      san: move.san,
      from: move.from,
      to: move.to,
      id_user,
      timestamp: new Date().getTime(),
      turn: chess.get_turn(),
      piece: move.piece,
      flags: move.flags,
    };
    this.votes.push(vote);

    // save vote to db
    const db = await DBConnector.get_instance();
    await db.save_vote(vote);

    const user = await db.get_user(id_user);

    // add stats to user
    const stats = await StatsHandler.get_instance();
    await stats.add_stats(id_user, "votes_count", 1);
    await stats.set_num_of_games_played(id_user);

    console.log(
      `[${new Date().toISOString()}] ${user?.display_name} voted for move: ${
        move.san
      }`
    );
    return true;
  }

  async get_game_result(): Promise<string | null> {
    const chess = await ChessGame.get_instance();
    return chess.get_game_result();
  }

  async get_game_update() {
    // TODO find better solution for this
    const db = await DBConnector.get_instance();
    const chess_game = await ChessGame.get_instance();
    const votes: any = [];

    // replace id_user with display_name
    for (let i = 0; i < this.votes.length; i++) {
      const vote = this.votes[i];
      const user = await db.get_user(vote.id_user);
      vote.display_name = user?.display_name;
      votes.push(vote);
    }
    return {
      id_game: this.id_game,
      timestamp_started: this.timestamp_started,
      timestamp_next: this.timestamp_next,
      votes: votes,
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

  has_user_voted(id_user: number): Vote | undefined {
    // TODO get user by id_user
    return this.votes.find((vote) => vote.id_user == id_user);
  }
}
