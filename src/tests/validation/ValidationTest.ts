import { ValidationManager } from "../../systems/validation/ValidationManager";

describe("Validation Tests", () => {
  test("Validation Operations", () => {
    const validation = new ValidationManager();
    expect(validation).toBeDefined();
    expect(validation.manageValidation).toBeDefined();
  });
});
