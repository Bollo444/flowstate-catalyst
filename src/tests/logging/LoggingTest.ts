import { LogManager } from "../../systems/log/LogManager";

describe("Logging Tests", () => {
  test("Log Operations", () => {
    const logging = new LogManager();
    expect(logging).toBeDefined();
    expect(logging.manageLog).toBeDefined();
  });
});
