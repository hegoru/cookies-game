import { GameObject } from "./gameObject.js";

export class Cookie extends GameObject {
  constructor(textures, hp, opts = {}) {
    super(textures[0]);

    this.textures = textures;

    this.anchor.set(0.5);

    this.y = -this.height;
    this.rotation = Math.random() * Math.PI * 2;

    this.fallSpeed = opts.speed || 5;
    this.rotationSpeed = opts.rotationSpeed || 0.02;

    this.hp = hp;
    this.currentHp = this.hp;
  }

  hasEnoughHitPoints() {
    return this.currentHp > 0;
  }

  hasNotEnoughHitPoints() {
    return !this.hasEnoughHitPoints();
  }

  hit() {
    this.currentHp -= 1;
  }

  fallDown() {
    this.y += this.fallSpeed;
    this.rotation += this.rotationSpeed;
  }

  get size() {
    return this.height * this.scale.y;
  }

  scoreValue() {
    return this.hp;
  }

  swapTexture() {
    this.texture = this.textures[this.hp - this.currentHp];
  }
}
