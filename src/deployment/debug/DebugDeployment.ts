export class DebugDeployment {
  private readonly debuggers = new Map<string, DebugConfig>();
  private readonly manager: DeploymentManager;

  deployDebug(config: DeployConfig): DeployResult {
    const deployed = this.processDebug(config);
    return this.generateDeployReport(deployed);
  }
}
