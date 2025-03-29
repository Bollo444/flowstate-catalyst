import { AnalyticsManager } from "../../systems/analytics/AnalyticsManager";

describe("Analytics Manager Tests", () => {
  test("Analytics Operations", () => {
    const analytics = new AnalyticsManager();
    expect(analytics).toBeDefined();
    expect(analytics.manageAnalytics).toBeDefined();
  });
});
