export default class Vote {
  id_game: number = 0;
  id_vote: number = 0;
  user: string = "";
  timestamp: number = 0;
  move: string = "";

  constructor(
    id_game: number,
    id_vote: number,
    timestamp: number,
    user: string,
    move: string
  ) {
    this.id_game = id_game;
    this.id_vote = id_vote;
    this.timestamp = timestamp;
    this.user = user;
    this.move = move;
  }

  toString(): string {
    return JSON.stringify(this);
  }
}
