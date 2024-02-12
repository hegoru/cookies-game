export class Timer {
  constructor(opts = {}) {
    this.value = 0.0;
    this.maxValue = opts.maxValue;
    this.step = opts.step || 1;
  }

  tick() {
    this.value += this.step;
  }

  tickBy(value) {
    this.value += value;
  }

  reset() {
    this.value = 0;
  }

  timeIsOver() {
    return this.value >= this.maxValue;
  }
}
