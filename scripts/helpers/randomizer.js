export class Randomizer {
  /**
   *
   * @param {Number} min
   * @param {Number} max
   * @returns value that is no lower than (and may possibly equal) min, and is less than (and not equal) max.
   */
  static intBetweenIncl(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
  }

  /**
   *
   * @param {Number} min value from
   * @param {Number} max
   * @returns value that is no lower than (and may possibly equal) min, and is less than (and not equal) max.
   */
  static intBetween(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
  }

  static floatBetween(min, max) {
    return Math.random() * (max - min) + min;
  }

  static float() {
    return Math.random();
  }
}
