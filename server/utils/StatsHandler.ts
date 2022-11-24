import DBConnector from "./DBConnector";
import { Stats, UserMove, User } from "./types/Global";

export default class StatsHandler {
  static instance: StatsHandler;

  static async get_instance(): Promise<StatsHandler> {
    if (!this.instance) this.instance = new StatsHandler();
    return this.instance;
  }

  constructor() {
    console.log("New Stats instance created");
  }

  async get_stats_leaderboard(): Promise<User[]> {
    const db = await DBConnector.get_instance();
    const users = await db.get_users();

    // filter public and private profiles
    const filtered = users.filter((user) => user.visibility === "public");
    const sorted = filtered.sort(
      (a, b) => b.stats.votes_count - a.stats.votes_count
    );
    // filter top 10
    const top10 = sorted.slice(0, 10);
    // delete auth data from user objects
    top10.forEach((user) => delete user.auth);
    return top10;
  }

  async get_stats(id_user: number): Promise<Stats> {
    const db = await DBConnector.get_instance();
    return await db.get_user_stats(id_user);
  }

  async set_stats(id_user: number, stats: Stats): Promise<void> {
    const db = await DBConnector.get_instance();
    await db.save_user_stats(id_user, stats);
  }

  async add_stats_moved_piece(
    id_user: number,
    piece: keyof Stats["moved_pieces"],
    amount: number
  ): Promise<void> {
    var stats = await this.get_stats(id_user);
    stats.moved_pieces[piece] += amount;
    await this.set_stats(id_user, stats);
  }

  async add_stats(
    id_user: number,
    stat: keyof Stats,
    amount: number
  ): Promise<void> {
    var stats = await this.get_stats(id_user);
    if (stat === "moved_pieces") return;
    stats[stat] += amount;
    await this.set_stats(id_user, stats);
  }

  async set_num_of_games_played(id_user: number): Promise<void> {
    // check how many votes in different games the user has
    var stats = await this.get_stats(id_user);
    const db = await DBConnector.get_instance();
    // get all votes from user
    const votes = await db.get_votes_user(id_user);
    // get number of different games in votes
    const num_of_games = new Set(votes.map((vote) => vote.id_game)).size;
    // add number of games to stats
    stats.games_played_in = num_of_games;
    // save stats
    await this.set_stats(id_user, stats);
  }

  async update_move_stats(
    id_user: number,
    move: UserMove | false
  ): Promise<void> {
    if (!move) return;

    var promises = [];

    // add stats to user
    switch (move.piece) {
      case "p":
        promises.push(this.add_stats_moved_piece(id_user, "pawn", 1));
        break;
      case "n":
        promises.push(this.add_stats_moved_piece(id_user, "knight", 1));
        break;
      case "b":
        promises.push(this.add_stats_moved_piece(id_user, "bishop", 1));
        break;
      case "r":
        promises.push(this.add_stats_moved_piece(id_user, "rook", 1));
        break;
      case "q":
        promises.push(this.add_stats_moved_piece(id_user, "queen", 1));
        break;
      case "k":
        promises.push(this.add_stats_moved_piece(id_user, "king", 1));
        break;
    }

    switch (move.flags) {
      case "e":
        promises.push(this.add_stats(id_user, "en_passant", 1));
        break;
      case "c":
        promises.push(this.add_stats(id_user, "captures", 1));
        break;
      case "p":
        promises.push(this.add_stats(id_user, "promotion", 1));
        break;
      case "k":
      case "q":
        promises.push(this.add_stats(id_user, "castle", 1));
        break;
    }

    if (move.san.includes("+"))
      promises.push(this.add_stats(id_user, "checks", 1));
    if (move.san.includes("#"))
      promises.push(this.add_stats(id_user, "checkmates", 1));

    await Promise.all(promises);
  }
}
