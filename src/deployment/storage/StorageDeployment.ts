export class StorageDeployment {
  private readonly storages = new Map<string, StorageConfig>();
  private readonly manager: DeploymentManager;

  deployStorage(config: DeployConfig): DeployResult {
    const deployed = this.processStorage(config);
    return this.generateDeployReport(deployed);
  }
}
