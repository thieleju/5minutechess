import Vote from "./Vote";

export default class Move {
  id_game: number = 0;
  id_move: number = 0;
  timestamp: number = 0;

  move: string = "";
  color: string = "";
  votes: Vote[] = [];

  constructor(
    id_game: number,
    id_move: number,
    timestamp: number,
    move: string,
    color: string,
    votes?: Vote[]
  ) {
    this.id_game = id_game;
    this.id_move = id_move;
    this.timestamp = timestamp;
    this.move = move;
    this.color = color;
    this.votes = votes || [];
  }

  toString(): string {
    return JSON.stringify(this);
  }
}
