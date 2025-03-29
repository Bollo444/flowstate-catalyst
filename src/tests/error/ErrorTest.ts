import { ErrorManager } from "../../systems/error/ErrorManager";

describe("Error Tests", () => {
  test("Error Operations", () => {
    const error = new ErrorManager();
    expect(error).toBeDefined();
    expect(error.manageError).toBeDefined();
  });
});
