import { StreamManager } from "../../systems/stream/StreamManager";

describe("Stream Tests", () => {
  test("Stream Operations", () => {
    const stream = new StreamManager();
    expect(stream).toBeDefined();
    expect(stream.manageStream).toBeDefined();
  });
});
