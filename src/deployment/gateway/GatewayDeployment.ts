export class GatewayDeployment {
  private readonly gateways = new Map<string, GatewayConfig>();
  private readonly manager: DeploymentManager;

  deployGateway(config: DeployConfig): DeployResult {
    const deployed = this.processGateway(config);
    return this.generateDeployReport(deployed);
  }
}
