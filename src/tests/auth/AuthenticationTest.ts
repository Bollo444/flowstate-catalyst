import { AuthenticationManager } from "../../systems/auth/AuthenticationManager";

describe("Authentication Tests", () => {
  test("Auth Operations", () => {
    const auth = new AuthenticationManager();
    expect(auth).toBeDefined();
    expect(auth.manageAuth).toBeDefined();
  });
});
