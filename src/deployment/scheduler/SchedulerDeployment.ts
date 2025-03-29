export class SchedulerDeployment {
  private readonly schedulers = new Map<string, SchedulerConfig>();
  private readonly manager: DeploymentManager;

  deployScheduler(config: DeployConfig): DeployResult {
    const deployed = this.processScheduler(config);
    return this.generateDeployReport(deployed);
  }
}
