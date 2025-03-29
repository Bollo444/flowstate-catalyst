export class RegistryDeployment {
  private readonly registries = new Map<string, RegistryConfig>();
  private readonly manager: DeploymentManager;

  deployRegistry(config: DeployConfig): DeployResult {
    const deployed = this.processRegistry(config);
    return this.generateDeployReport(deployed);
  }
}
