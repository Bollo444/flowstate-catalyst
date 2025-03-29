export class CoreHealthChecker {
  private readonly checkers = new Map<string, HealthChecker>();
  private readonly engine: HealthEngine;

  checkHealth(context: HealthContext): HealthResult {
    const checked = this.processHealth(context);
    return this.generateHealthReport(checked);
  }
}
