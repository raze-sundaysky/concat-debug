const stringify = require("../src/stringify.js");

test("should stringify object to string", () => {
  const object = [
    ["1AAA", "0:00.000"],
    ["1BBB", "0:12.300"],
    ["1CCC", "0:32.040"]
  ];

  expect(stringify(object)).toEqual(`1AAA\t0:00.000
1BBB\t0:12.300
1CCC\t0:32.040`);
});
