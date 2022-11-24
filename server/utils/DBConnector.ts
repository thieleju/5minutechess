import { Game, Move, Stats, User, Vote } from "./types/Global";

export default class DBConnector {
  private STORAGE: string = "dev";

  static instance: DBConnector;

  static async get_instance(): Promise<DBConnector> {
    if (!this.instance) {
      this.instance = new DBConnector();

      // switch between development (fs) and production (redis) database
      if (process.env.NODE_ENV === "development") this.instance.STORAGE = "dev";
      else this.instance.STORAGE = "redis";

      console.log(`DBConnector using ${this.instance.STORAGE} storage`);

      return this.instance;
    } else return this.instance;
  }

  constructor() {
    console.log(`New DBConnector instance created`);
  }

  /**
   * Saves game, move and vote data to the database
   * All promises are executed in parallel
   */
  async save_game_finshed(game: Game, moves: Move[], votes: Vote[]) {
    var promises: Promise<void>[] = [];
    // save game
    promises.push(this.set_db_game(game));
    // save moves
    for (let move of moves) {
      promises.push(this.set_db_move(game.id_game, move));
    }
    // save votes
    for (let vote of votes) {
      promises.push(this.set_db_vote(game.id_game, vote));
    }
    Promise.all(promises);
  }

  // ############# CURRENT GAME #############
  private async get_db_game_current(): Promise<Game> {
    return useStorage().getItem(`${this.STORAGE}:game:current`);
  }

  private async set_db_game_current(game: Game): Promise<void> {
    return useStorage().setItem(`${this.STORAGE}:game:current`, game);
  }

  async save_game_current(game: Game): Promise<void> {
    await this.set_db_game_current(game);
  }

  async get_game(): Promise<Game> {
    return await this.get_db_game_current();
  }

  async save_game(game: Game): Promise<void> {
    await this.set_db_game(game);
  }

  async get_id_game(): Promise<number> {
    var game = await this.get_db_game_current();
    if (!game) throw "No game to get id_game!";
    return game.id_game;
  }

  async save_fen(fen: string): Promise<void> {
    var game = await this.get_db_game_current();
    if (!game) throw "No game to save fen!";
    game.fen = fen;
    await this.set_db_game_current(game);
  }

  async get_fen(): Promise<string> {
    var game = await this.get_db_game_current();
    if (!game) throw "No game to get fen!";
    return game.fen;
  }

  async save_timestamp_next(timestamp: number): Promise<void> {
    var game = await this.get_db_game_current();
    if (!game) throw "No game to save timestamp_next!";
    game.timestamp_next = timestamp;
    await this.set_db_game_current(game);
  }

  async get_timestamp_next(): Promise<number> {
    var game = await this.get_db_game_current();
    if (!game) throw "No game to get timestamp_next!";
    return game.timestamp_next;
  }

  // ############# GAME #############
  private async get_db_game(id_game: number): Promise<Game> {
    return useStorage().getItem(`${this.STORAGE}:game:${id_game}`);
  }

  private async set_db_game(game: Game): Promise<void> {
    return useStorage().setItem(`${this.STORAGE}:game:${game.id_game}`, game);
  }

  // ############# MOVE #############
  private async get_db_move(id_game: number, id_move: number): Promise<Move> {
    return useStorage().getItem(`${this.STORAGE}:move:${id_game}:${id_move}`);
  }

  private async set_db_move(id_game: number, move: Move): Promise<void> {
    return useStorage().setItem(
      `${this.STORAGE}:move:${id_game}:${move.id_move}`,
      move
    );
  }

  async get_moves(): Promise<Move[]> {
    var moves: Move[] = [];

    const game = await this.get_db_game_current();
    if (!game) return [];

    var end = false;
    while (!end) {
      var move = await this.get_db_move(game.id_game, moves.length);
      if (move) moves.push(move);
      else end = true;
    }

    return moves;
  }

  async save_move(move: Move): Promise<void> {
    var moves: Move[] = await this.get_moves();
    const id_game: number = await this.get_id_game();
    move.id_move = moves.length;
    await this.set_db_move(id_game, move);
  }

  async get_move_by_id(id_move: number): Promise<Move> {
    const id_game: number = await this.get_id_game();
    return await this.get_db_move(id_game, id_move);
  }

  // ############# VOTE #############
  private async get_db_vote(id_game: number, id_vote: number): Promise<Vote> {
    return useStorage().getItem(`${this.STORAGE}:vote:${id_game}:${id_vote}`);
  }

  private async set_db_vote(id_game: number, vote: Vote): Promise<void> {
    return useStorage().setItem(
      `${this.STORAGE}:vote:${id_game}:${vote.id_vote}`,
      vote
    );
  }

  async get_votes(): Promise<Vote[]> {
    var votes: Vote[] = [];

    const game = await this.get_db_game_current();
    if (!game) throw "No game to get votes!";

    var end = false;
    while (!end) {
      var vote = await this.get_db_vote(game.id_game, votes.length);
      if (vote) votes.push(vote);
      else end = true;
    }

    return votes;
  }

  async get_votes_user(id_user: number): Promise<Vote[]> {
    var votes: Vote[] = await this.get_votes();
    return votes.filter((vote) => vote.id_user == id_user);
  }

  async save_vote(vote: Vote): Promise<void> {
    var votes: Vote[] = await this.get_votes();
    const id_game: number = await this.get_id_game();
    vote.id_vote = votes.length;
    await this.set_db_vote(id_game, vote);
  }

  // ############# USER #############
  private async get_db_user(id_user: number): Promise<User> {
    return useStorage().getItem(`${this.STORAGE}:user:${id_user}`);
  }

  private async set_db_user(user: User): Promise<void> {
    return useStorage().setItem(`${this.STORAGE}:user:${user.id_user}`, user);
  }

  async get_users(): Promise<User[]> {
    var users: User[] = [];

    var end = false;
    while (!end) {
      var user = await this.get_db_user(users.length);
      if (user) users.push(user);
      else end = true;
    }

    return users;
  }

  async get_user(id_user: number): Promise<User> {
    return await this.get_db_user(id_user);
  }

  async get_user_by_auth_id(id: number | string): Promise<User | undefined> {
    var users: User[] = await this.get_users();
    const github = users.find((user) => user.auth?.github?.id === id);
    const lichess = users.find((user) => user.auth?.lichess?.id === id);
    const discord = users.find((user) => user.auth?.discord?.id === id);
    return github || lichess || discord;
  }

  async add_new_user(
    platform: string,
    id: number,
    username: string
  ): Promise<void> {
    console.log("add new user", platform, id, username);
    // add new github user
    var users: User[] = await this.get_users();
    await this.set_db_user({
      id_user: users.length,
      display_name: username,
      visibility: "public",
      stats: {
        games_played_in: 0,
        votes_count: 0,
        captures: 0,
        en_passant: 0,
        promotion: 0,
        castle: 0,
        checks: 0,
        checkmates: 0,
        moved_pieces: {
          pawn: 0,
          knight: 0,
          bishop: 0,
          rook: 0,
          queen: 0,
          king: 0,
        },
      },
      auth: {
        lichess:
          platform == "lichess" ? { id, username, visibility: "public" } : null,
        discord:
          platform == "discord"
            ? { id: id, username, visibility: "public" }
            : null,
        github:
          platform == "github" ? { id, username, visibility: "public" } : null,
      },
    });
  }

  async update_user_auth(
    platform: string,
    id: number | string,
    username: string
  ): Promise<void> {
    // update existing user
    var users: User[] = await this.get_users();
    var user = users.find((user) => {
      if (platform == "lichess") return user.auth?.lichess?.id == id;
      if (platform == "discord") return user.auth?.discord?.id == id;
      if (platform == "github") return user.auth?.github?.id == id;
    });

    if (!user) throw `User not found! ${platform} ${id} ${username}`;

    if (platform == "lichess")
      user.auth.lichess = { id, username, visibility: "public" };

    if (platform == "discord")
      user.auth.discord = { id, username, visibility: "public" };

    if (platform == "github")
      user.auth.github = { id, username, visibility: "public" };

    await this.set_db_user(user);
  }

  async get_user_stats(id_user: number): Promise<Stats> {
    var user = await this.get_db_user(id_user);
    return user.stats;
  }

  async save_user_stats(id_user: number, stats: Stats): Promise<void> {
    var user = await this.get_user(id_user);
    user.stats = stats;
    await this.set_db_user(user);
  }
}
