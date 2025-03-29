export class StorageInfra {
  private readonly storage = new Map<string, StorageConfig>();
  private readonly manager: InfrastructureManager;

  configureStorage(options: ConfigOptions): ConfigResult {
    const configured = this.processConfig(options);
    return this.generateConfigReport(configured);
  }
}
