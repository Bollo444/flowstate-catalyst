export class NetworkInfra {
  private readonly networks = new Map<string, NetworkConfig>();
  private readonly manager: InfrastructureManager;

  configureNetwork(options: ConfigOptions): ConfigResult {
    const configured = this.processConfig(options);
    return this.generateConfigReport(configured);
  }
}
