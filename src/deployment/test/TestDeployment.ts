export class TestDeployment {
  private readonly tests = new Map<string, TestConfig>();
  private readonly manager: DeploymentManager;

  deployTest(config: DeployConfig): DeployResult {
    const deployed = this.processTest(config);
    return this.generateDeployReport(deployed);
  }
}
