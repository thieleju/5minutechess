export default class Piece {
  white: boolean = true;
  type: "p" | "r" | "n" | "b" | "q" | "k" = "p";
  image: string = "";

  constructor(white: boolean, type: "p" | "r" | "n" | "b" | "q" | "k") {
    this.white = white;
    this.type = type;
    this.image = `/pieces/${white ? "w" : "b"}_${this.type}.png`;
  }

  toString() {
    return this.image;
  }
}
