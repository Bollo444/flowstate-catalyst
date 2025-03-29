export class ServerlessDeployment {
  private readonly functions = new Map<string, ServerlessConfig>();
  private readonly manager: DeploymentManager;

  deployServerless(config: DeployConfig): DeployResult {
    const deployed = this.processServerless(config);
    return this.generateDeployReport(deployed);
  }
}
