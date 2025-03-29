export class ServiceHealthMonitor {
  private readonly monitors = new Map<string, HealthMonitor>();
  private readonly manager: HealthManager;

  checkHealth(service: ServiceHealth): HealthResult {
    const checked = this.processHealthCheck(service);
    return this.generateHealthReport(checked);
  }
}
