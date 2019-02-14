const concatDebugFiles = require("../src/concatDebugFiles.js");
const path = require("path");
const fs = require("fs-extra");
const tempy = require("tempy");
const projectFixturePath = path.join(__dirname, "fixtures", "project");

test("should concat multiple Debug.txt files into one", () => {
  const workingDir = tempy.directory();
  fs.copySync(projectFixturePath, workingDir);

  concatDebugFiles(workingDir);

  const masterDebugPath = path.join(workingDir, "masterDebug.txt");
  const masterDebugContents = fs.readFileSync(masterDebugPath, "utf-8");

  expect(masterDebugContents).toBe(`1AAA\t1:00.000
1BBB\t1:12.300
1CCC\t1:32.040
2AAA\t2:00.000
2BBB\t2:12.300
2CCC\t3:32.040
3AAA\t4:00.000
3BBB\t4:12.300
3CCC\t4:32.040`);
});
