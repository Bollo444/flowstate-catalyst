export class NextConfig {
  private readonly config = new Map<string, NextJSConfig>();
  private readonly manager: InfrastructureManager;

  configureNext(options: ConfigOptions): ConfigResult {
    const configured = this.processConfig(options);
    return this.generateConfigReport(configured);
  }
}
