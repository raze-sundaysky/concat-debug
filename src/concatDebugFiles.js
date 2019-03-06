const fs = require("fs-extra"); //File system
const path = require("path"); //Path
const globby = require("globby"); //batch files
const DebugFiles = require("./DebugFiles"); //Debug Class
const chalk = require("chalk"); //color terminal

//receives working dir, eventually generates a new file at dir
module.exports = workingDir => {
  const debugFilePaths = globby.sync(path.join(workingDir, "**", "Debug.txt")); //get all debug files
  const debugFiles = new DebugFiles();

  //parse into array and add each array to array
  debugFilePaths.forEach(file => {
    debugFiles.parseAndAddFiles(file);
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
