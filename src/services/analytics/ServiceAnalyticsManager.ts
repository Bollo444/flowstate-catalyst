export class ServiceAnalyticsManager {
  private readonly analytics = new Map<string, AnalyticsHandler>();
  private readonly manager: AnalyticsManager;

  manageAnalytics(request: AnalyticsRequest): AnalyticsResult {
    const managed = this.processAnalytics(request);
    return this.generateAnalyticsReport(managed);
  }
}
