export class TestingInfra {
  private readonly testers = new Map<string, TestConfig>();
  private readonly manager: InfrastructureManager;

  configureTesting(options: ConfigOptions): ConfigResult {
    const configured = this.processConfig(options);
    return this.generateConfigReport(configured);
  }
}
