import { CoreManager } from "../systems/core/CoreManager";
import { SystemManager } from "../systems/system/SystemManager";

describe("System Bootstrap", () => {
  test("Core System Initialization", () => {
    const core = new CoreManager();
    const system = new SystemManager();
    expect(core).toBeDefined();
    expect(system).toBeDefined();
  });
});
