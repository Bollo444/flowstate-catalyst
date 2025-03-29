import { CoreManager } from "../../systems/core/CoreManager";

describe("Core System Tests", () => {
  test("Core Initialization", () => {
    const core = new CoreManager();
    expect(core).toBeDefined();
    expect(core.manageCore).toBeDefined();
  });
});
