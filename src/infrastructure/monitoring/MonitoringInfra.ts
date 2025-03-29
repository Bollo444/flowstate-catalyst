export class MonitoringInfra {
  private readonly monitors = new Map<string, MonitorConfig>();
  private readonly manager: InfrastructureManager;

  configureMonitoring(options: ConfigOptions): ConfigResult {
    const configured = this.processConfig(options);
    return this.generateConfigReport(configured);
  }
}
