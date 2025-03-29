export class ProfilingDeployment {
  private readonly profilers = new Map<string, ProfilingConfig>();
  private readonly manager: DeploymentManager;

  deployProfiling(config: DeployConfig): DeployResult {
    const deployed = this.processProfiling(config);
    return this.generateDeployReport(deployed);
  }
}
