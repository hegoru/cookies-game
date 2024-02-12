export class DynamicScoreText extends PIXI.Text {
  constructor(text, textStyle) {
    super(text, textStyle);
    this.anchor.set(0.5);

    this.minAlpha = 0.1;
  }

  fadeOut(animationSpeed) {
    this.alpha -= animationSpeed;
  }

  moveUp(speed) {
    this.y -= speed;
  }

  isTransparent() {
    return this.alpha < this.minAlpha;
  }
}
