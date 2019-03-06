const fs = require("fs");
const parse = require("./parse");
const stringify = require("./stringify");
/**
 *
 * @param {string} timeText
 * @returns {number}
 */
function getMinute(timeText) {
  return Number(timeText.split(":")[0]);
}

/**
 *
 * @param {string} timeText
 * @param {number} minute
 */
function addTime(timeText, minute) {
  const newMinute = Number(timeText.split(":")[0]) + minute;
  return `${newMinute}:${timeText.split(":")[1]}`;
}

/**
 *
 * @param {string} filePath
 * @returns {array[]}
 */
function readAndParse(filePath) {
  let fileContents = fs.readFileSync(filePath, "utf-8");
  fileContents = fileContents.substring(0, fileContents.lastIndexOf("\n"));
  return parse(fileContents);
}

module.exports = class DebugFiles {
  constructor() {
    this.checkpoints = [];
  }

  shift() {
    let lastTime;
    let newMinute = 1;
    this.checkpoints = this.checkpoints.map(([text, time]) => {
      if (lastTime && time === `0:00.000`) {
        console.log(lastTime);
        newMinute = getMinute(lastTime) + 1;
      }

      const newTime = addTime(time, newMinute);
      lastTime = time === `0:00.000` ? "" : (lastTime = newTime);
      return [text, newTime];
    });
  }

  mergeToText() {
    return stringify(this.checkpoints);
  }

  parseAndAddFiles(filePath) {
    const checkpoints = readAndParse(filePath);
    this.checkpoints.push(...checkpoints);
  }
};
