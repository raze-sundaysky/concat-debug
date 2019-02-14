const fs = require("fs-extra");
const path = require("path");
const globby = require("globby");
const DebugFiles = require("./DebugFiles");
const chalk = require("chalk");

module.exports = workingDir => {
  const debugFilePaths = globby.sync(path.join(workingDir, "**", "Debug.txt"));

  const debugFiles = new DebugFiles();

  debugFilePaths.forEach(file => {
    debugFiles.addFile(file);
  });

  // Do the relevant transformations
  debugFiles.shift();

  const masterDebugContents = debugFiles.mergeToText();

  const masterDebugPath = path.join(workingDir, "masterDebug.txt");

  if (fs.existsSync(masterDebugPath)) {
    console.log("There is already a file in:");
    console.log(chalk.magenta(masterDebugPath));
    console.log("Overriding...");
    console.log();
  }

  console.log(chalk.green("created master file in:"));
  console.log(chalk.cyan(masterDebugPath));

  fs.outputFileSync(masterDebugPath, masterDebugContents);
};
