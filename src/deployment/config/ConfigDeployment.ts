export class ConfigDeployment {
  private readonly configs = new Map<string, ConfigConfig>();
  private readonly manager: DeploymentManager;

  deployConfig(config: DeployConfig): DeployResult {
    const deployed = this.processConfig(config);
    return this.generateDeployReport(deployed);
  }
}
