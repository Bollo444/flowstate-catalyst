export class EnvironmentConfig {
  private readonly environments = new Map<string, EnvConfig>();
  private readonly manager: InfrastructureManager;

  configureEnvironment(options: ConfigOptions): ConfigResult {
    const configured = this.processConfig(options);
    return this.generateConfigReport(configured);
  }
}
