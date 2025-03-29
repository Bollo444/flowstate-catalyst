export class TraceDeployment {
  private readonly traces = new Map<string, TraceConfig>();
  private readonly manager: DeploymentManager;

  deployTrace(config: DeployConfig): DeployResult {
    const deployed = this.processTrace(config);
    return this.generateDeployReport(deployed);
  }
}
