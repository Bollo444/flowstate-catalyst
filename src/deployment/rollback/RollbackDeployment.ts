export class RollbackDeployment {
  private readonly rollbacks = new Map<string, RollbackConfig>();
  private readonly manager: DeploymentManager;

  deployRollback(config: DeployConfig): DeployResult {
    const deployed = this.processRollback(config);
    return this.generateDeployReport(deployed);
  }
}
