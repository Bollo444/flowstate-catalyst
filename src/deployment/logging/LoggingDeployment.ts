export class LoggingDeployment {
  private readonly loggers = new Map<string, LogConfig>();
  private readonly manager: DeploymentManager;

  deployLogging(config: DeployConfig): DeployResult {
    const deployed = this.processLogging(config);
    return this.generateDeployReport(deployed);
  }
}
