import { SystemManager } from "../../systems/system/SystemManager";

describe("System Manager Tests", () => {
  test("System Initialization", () => {
    const system = new SystemManager();
    expect(system).toBeDefined();
    expect(system.manageSystem).toBeDefined();
  });
});
