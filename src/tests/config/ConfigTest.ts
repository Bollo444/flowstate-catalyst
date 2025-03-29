import { ConfigurationManager } from "../../systems/config/ConfigurationManager";

describe("Configuration Tests", () => {
  test("Config Operations", () => {
    const config = new ConfigurationManager();
    expect(config).toBeDefined();
    expect(config.manageConfig).toBeDefined();
  });
});
