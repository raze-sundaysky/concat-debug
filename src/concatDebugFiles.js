const fs = require("fs-extra");
const path = require("path");
const globby = require("globby");
const DebugFiles = require("./DebugFiles");

module.exports = workingDir => {
  const debugFilePaths = globby.sync(path.join(workingDir, "**", "Debug.txt"));

  const debugFiles = new DebugFiles();

  debugFilePaths.forEach(file => {
    debugFiles.addFile(file);
  });

  debugFiles.shift();
  const masterDebugContents = debugFiles.mergeToText();

  const masterDebugPath = path.join(workingDir, "masterDebug.txt");
  fs.outputFileSync(masterDebugPath, masterDebugContents);
};
