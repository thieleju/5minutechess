import { Game } from "./types/Game";
import { Move } from "./types/Move";
import { User } from "./types/User";
import { Vote } from "./types/Vote";

export default class DBConnector {
  private DB_CURRENT: string = "db:DB_CURRENT.json";
  private DB_GAMES: string = "db:DB_GAMES.json";
  private DB_USERS: string = "db:DB_USERS.json";

  static instance: DBConnector;

  static async get_instance(): Promise<DBConnector> {
    if (!this.instance) {
      this.instance = new DBConnector();
      return this.instance;
    } else return this.instance;
  }

  constructor() {
    console.log("New DBConnector instance created");
  }

  async save_move(move: Move) {
    var game = await this.get_game_current();
    game.moves.push(move);
    await this.save_game_current(game);
  }

  async save_fen(fen: string) {
    var game = await this.get_game_current();
    game.fen = fen;
    await this.save_game_current(game);
  }

  async save_vote_history(vote: Vote) {
    var game = await this.get_game_current();
    game.votes_history.push(vote);
    await this.save_game_current(game);
  }

  async save_timestamp_next(timestamp: number) {
    var game = await this.get_game_current();
    if (!game) return;
    game.timestamp_next = timestamp;
    await this.save_game_current(game);
  }

  async save_game_current(game: Game) {
    await useStorage().setItem(this.DB_CURRENT, game);
  }

  async save_game_fnished(game: Game) {
    // add finished game to games history array
    var games_history = await useStorage().getItem(this.DB_GAMES);

    // save first game to history or add game to other games
    if (!games_history) games_history = [game];
    else games_history.push(game);

    console.log("Saved game", game);
    await useStorage().setItem(this.DB_GAMES, games_history);
  }

  async save_users(user: User) {
    // add finished game to games history array
    var users_history = await useStorage().getItem(this.DB_USERS);

    // save first game to history or add game to other games
    if (!users_history) users_history = [user];
    else users_history.push(user);

    console.log("Saved user", user);
    await useStorage().setItem(this.DB_USERS, users_history);
  }

  async get_game_current(): Promise<Game> {
    return await useStorage().getItem(this.DB_CURRENT);
  }

  async get_games(): Promise<Game[]> {
    return await useStorage().getItem(this.DB_GAMES);
  }

  async get_users(): Promise<User[]> {
    return await useStorage().getItem(this.DB_USERS);
  }

  async get_user(id_user: string): Promise<User> {
    // TODO get user by id_user
    return {};
  }
}
