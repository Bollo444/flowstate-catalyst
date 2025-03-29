export class ContainerInfra {
  private readonly containers = new Map<string, ContainerConfig>();
  private readonly manager: InfrastructureManager;

  configureContainer(options: ConfigOptions): ConfigResult {
    const configured = this.processConfig(options);
    return this.generateConfigReport(configured);
  }
}
