import { StateManager } from "../../systems/state/StateManager";

describe("State Tests", () => {
  test("State Operations", () => {
    const state = new StateManager();
    expect(state).toBeDefined();
    expect(state.manageState).toBeDefined();
  });
});
