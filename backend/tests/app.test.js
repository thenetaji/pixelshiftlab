const { sum } = require("../app.js");

test("Adding", () => {
  expect(sum(1, 2)).toBe(3);
});
