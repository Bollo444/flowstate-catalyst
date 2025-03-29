import { StorageManager } from "../../systems/storage/StorageManager";

describe("Storage Tests", () => {
  test("Storage Operations", () => {
    const storage = new StorageManager();
    expect(storage).toBeDefined();
    expect(storage.manageStorage).toBeDefined();
  });
});
