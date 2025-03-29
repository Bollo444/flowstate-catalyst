import { AlertManager } from "../../systems/alert/AlertManager";

describe("Alert Tests", () => {
  test("Alert Operations", () => {
    const alert = new AlertManager();
    expect(alert).toBeDefined();
    expect(alert.manageAlert).toBeDefined();
  });
});
