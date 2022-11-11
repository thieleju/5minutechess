import Board from "./Board";
import Move from "./Move";
import Vote from "./Vote";

var GAME_INVERVAL: NodeJS.Timer;
const GAME_TICK_RATE: number = 1000;
const GAME_DB_ITEM: string = "db:game_current.json";

type VotedMove = {
  move: string;
  count: number;
};

export default class Game {
  id_game: number = 0;
  timestamp_started: number = 0;
  whites_turn: boolean = true;
  moves: Move[] = [];
  votes: Vote[] = [];

  fen_start: string = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";
  fen: string = "";

  static instance: Game;

  static async get_instance() {
    // create new game instance or reply with existing one
    if (!this.instance) {
      this.instance = new Game();
      // initailize game with data from storage
      await this.instance.initialize_game();
      // start game loop
      this.instance.start_game_loop();
    }
    return this.instance;
  }

  constructor() {
    console.log("New game instance created");
  }

  // game loop to check if time is up and do most voted move
  start_game_loop() {
    GAME_INVERVAL = setInterval(
      async () => await this.game_tick(),
      GAME_TICK_RATE
    );
    console.log(`Game loop running with tick rate ${GAME_TICK_RATE}ms`);
  }

  stop_game_loop() {
    clearInterval(GAME_INVERVAL);
    console.log(`Game loop stopped`);
  }

  async game_tick() {
    // check if time is up, no -> skip, yes -> new move
    if (new Date().getTime() < this.timestamp_started) return;

    // skip if no votes
    if (this.votes.length == 0) {
      console.log("No votes, resetting timer");
      // reset timestamp
      this.timestamp_started = this.get_new_timestamp();
      // save to storage
      this.save_game();
      return;
    }

    // find most voted move
    const most_voted_move: VotedMove | undefined = this.find_most_voted_move();

    if (!most_voted_move) throw new Error("No most voted move found");

    // add move to moves
    await this.add_move(
      most_voted_move.move,
      this.whites_turn ? "w" : "b",
      this.votes
    );

    // TODO check if game is over
    // start new game if game is over
    if (this.moves.length >= 40) {
      this.start_new_game();
    }

    // reset timestamp
    this.timestamp_started = this.get_new_timestamp();
    // reset votes
    this.votes = [];
    console.log("cleared votes");
  }

  find_most_voted_move(): VotedMove | undefined {
    // loop through votes and count votes for each move
    var counted: Array<VotedMove> = [];
    this.votes.forEach((vote: Vote) => {
      let found = counted.find((c) => c.move == vote.move);
      if (found) found.count++;
      else
        counted.push({
          move: vote.move,
          count: 1,
        });
    });
    // find most voted move in array and return it
    return counted.find(
      (v) => v.count == Math.max(...counted.map((v) => v.count))
    );
  }

  async add_vote(user: string, move: string) {
    // TODO check if user has already voted
    if (this.votes.find((vote) => vote.user == user))
      throw new Error("User has already voted");

    // add vote to votes
    this.votes.push(
      new Vote(
        this.id_game,
        this.votes.length,
        new Date().getTime(),
        user,
        move
      )
    );

    // save to storage
    this.save_game();
  }

  async add_move(move: string, color: string, votes: Vote[]) {
    // TODO check if move is valid
    const board = await Board.get_instance();
    board.make_move(move, color);
    this.fen = board.get_fen_from_board();

    // add move to moves
    this.moves.push(
      new Move(
        this.id_game,
        this.moves.length,
        new Date().getTime(),
        move,
        color,
        votes
      )
    );

    // save to storage
    this.save_game();
  }

  async start_new_game() {
    this.id_game++;
    this.whites_turn = true;
    this.moves = [];
    this.votes = [];

    this.timestamp_started = this.get_new_timestamp();

    this.fen = this.fen_start;

    // initailize board
    const board = await Board.get_instance();
    board.set_fen_and_turn(this.fen, this.whites_turn);

    console.log("new game started, board set", this.id_game);

    // save to storage
    this.save_game();
  }

  get_new_timestamp(): number {
    // get timestamp when minute is modulo 5 in the future
    // e.g. 5:00, 5:05, 5:10, 5:15, ...
    const date = new Date();
    const timestamp =
      date.getTime() +
      // (5 - (date.getUTCMinutes() % 5)) * 60 * 1000 -
      (2 - (date.getUTCMinutes() % 2)) * 60 * 1000 -
      date.getUTCSeconds() * 1000 -
      date.getUTCMilliseconds();
    return timestamp;
  }

  async initialize_game() {
    // read data from storage
    const game = await useStorage().getItem(GAME_DB_ITEM);

    // check if game is currently going on
    if (!game.fen) {
      console.log("No game found");
      // start new game
      this.start_new_game();
      return;
    }

    this.id_game = game.id_game;
    this.timestamp_started = game.timestamp_started;
    this.whites_turn = game.whites_turn;
    this.fen = game.fen;

    // initailize board
    const board = await Board.get_instance();
    board.set_fen_and_turn(this.fen, this.whites_turn);

    // initialize moves
    this.moves = game.moves.map(
      (move: Move) =>
        new Move(
          move.id_game,
          move.id_move,
          move.timestamp,
          move.move,
          move.color,
          move.votes
        )
    );

    // initialize votes
    this.votes = game.votes.map(
      (vote: Vote) =>
        new Vote(
          vote.id_game,
          vote.id_vote,
          vote.timestamp,
          vote.user,
          vote.move
        )
    );

    console.log(
      "Ongoing game initialized: ",
      this.id_game,
      " moves: ",
      this.moves.length
    );
  }

  async save_game() {
    let temp = this;
    // delete temp.board;
    await useStorage().setItem(GAME_DB_ITEM, temp);
  }
}
