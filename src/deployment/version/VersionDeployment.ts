export class VersionDeployment {
  private readonly versions = new Map<string, VersionConfig>();
  private readonly manager: DeploymentManager;

  deployVersion(config: DeployConfig): DeployResult {
    const deployed = this.processVersion(config);
    return this.generateDeployReport(deployed);
  }
}
