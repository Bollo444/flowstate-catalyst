import { AnalyticsLayer } from "../../analytics/AnalyticsLayer";

describe("Analytics Layer Tests", () => {
  test("Analytics Processing", () => {
    const analytics = new AnalyticsLayer();
    expect(analytics).toBeDefined();
    expect(analytics.analyze).toBeDefined();
  });
});
