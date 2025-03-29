import { FlowStateCatalyst } from "../../FlowStateCatalyst";

describe("Performance Tests", () => {
  test("Application Performance", () => {
    const app = new FlowStateCatalyst();
    const startTime = Date.now();
    app.initialize();
    const endTime = Date.now();

    expect(endTime - startTime).toBeLessThan(1000);
  });
});
