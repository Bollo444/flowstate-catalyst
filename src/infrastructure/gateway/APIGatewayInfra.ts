export class APIGatewayInfra {
  private readonly gateways = new Map<string, GatewayConfig>();
  private readonly manager: InfrastructureManager;

  configureGateway(options: ConfigOptions): ConfigResult {
    const configured = this.processConfig(options);
    return this.generateConfigReport(configured);
  }
}
