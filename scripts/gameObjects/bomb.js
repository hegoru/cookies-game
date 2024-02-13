import { GameObject } from "./gameObject.js";

export class Bomb extends GameObject {
  constructor(src, opts = {}) {
    super(src);
    this.anchor.set(0.5);

    this.y = -this.height;

    this.fallSpeed = opts.fallSpeed || 5;
  }

  fallDown() {
    this.y += this.fallSpeed;
  }
}
