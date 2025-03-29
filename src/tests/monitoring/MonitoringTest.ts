import { MonitoringLayer } from "../../monitoring/MonitoringLayer";

describe("Monitoring Layer Tests", () => {
  test("Monitoring Systems", () => {
    const monitoring = new MonitoringLayer();
    expect(monitoring).toBeDefined();
    expect(monitoring.monitor).toBeDefined();
  });
});
