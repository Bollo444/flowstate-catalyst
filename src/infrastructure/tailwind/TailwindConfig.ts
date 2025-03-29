export class TailwindConfig {
  private readonly config = new Map<string, TailwindSettings>();
  private readonly manager: InfrastructureManager;

  configureTailwind(options: ConfigOptions): ConfigResult {
    const configured = this.processConfig(options);
    return this.generateConfigReport(configured);
  }
}
