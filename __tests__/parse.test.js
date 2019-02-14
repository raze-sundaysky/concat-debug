const parse = require("../src/parse.js");

test("should parse string to object", () => {
  const content = `1AAA\t0:00.000
1BBB\t0:12.300
1CCC\t0:32.040`;

  expect(parse(content)).toEqual([
    ["1AAA", "0:00.000"],
    ["1BBB", "0:12.300"],
    ["1CCC", "0:32.040"]
  ]);
});
