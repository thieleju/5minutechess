export default class Piece {
  white: boolean = true;
  type: "p" | "r" | "n" | "b" | "q" | "k" = "p";
  image: string = "";
  image_base: string = "../assets/pieces/";

  constructor(white: boolean, type: "p" | "r" | "n" | "b" | "q" | "k") {
    this.white = white;
    this.type = type;
    this.image = `${this.image_base}${white ? "w" : "b"}_${this.type}.png`;
  }

  toString() {
    return this.image;
  }
}
