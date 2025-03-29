import { DebugManager } from "../../systems/debug/DebugManager";

describe("Debug Tests", () => {
  test("Debug Operations", () => {
    const debug = new DebugManager();
    expect(debug).toBeDefined();
    expect(debug.manageDebug).toBeDefined();
  });
});
