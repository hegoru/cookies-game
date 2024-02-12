export class ScoreManager {
  constructor(opts = {}) {
    this.minScore = opts.minScore || 0;
    this.score = this.minScore;
    this.bestScore = this.score;
  }

  increaseScore() {
    this.score++;
  }

  increaseScoreBy(value) {
    this.score += value;
  }

  decreaseScore() {
    this.score--;
  }

  decreaseScoreBy(value) {
    this.score -= value;
  }

  resetScore() {
    this.score = 0;
  }

  updateBestScore(value) {
    this.bestScore = value;
  }
}
