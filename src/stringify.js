module.exports = parsed => {
  return parsed.map(arr => arr.join("\t")).join("\n");
};
