export class ServiceConfigurationManager {
  private readonly configs = new Map<string, ConfigHandler>();
  private readonly manager: ConfigManager;

  manageConfig(request: ConfigRequest): ConfigResult {
    const managed = this.processConfig(request);
    return this.generateConfigReport(managed);
  }
}
