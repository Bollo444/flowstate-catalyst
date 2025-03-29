import { TestManager } from "../../systems/test/TestManager";

describe("Test Manager Tests", () => {
  test("Test Operations", () => {
    const testManager = new TestManager();
    expect(testManager).toBeDefined();
    expect(testManager.manageTest).toBeDefined();
  });
});
