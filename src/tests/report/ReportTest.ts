import { ReportManager } from "../../systems/report/ReportManager";

describe("Report Tests", () => {
  test("Report Operations", () => {
    const report = new ReportManager();
    expect(report).toBeDefined();
    expect(report.manageReport).toBeDefined();
  });
});
