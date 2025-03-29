export class ServicePerformanceManager {
  private readonly performers = new Map<string, PerformanceHandler>();
  private readonly manager: PerformanceManager;

  managePerformance(request: PerformanceRequest): PerformanceResult {
    const managed = this.processPerformance(request);
    return this.generatePerformanceReport(managed);
  }
}
