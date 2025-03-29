import { DatabaseManager } from "../../systems/database/DatabaseManager";

describe("Database Tests", () => {
  test("Database Operations", () => {
    const database = new DatabaseManager();
    expect(database).toBeDefined();
    expect(database.manageDatabase).toBeDefined();
  });
});
