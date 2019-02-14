module.exports = txt => {
  return txt.split("\n").map(str => str.split("\t"));
};
