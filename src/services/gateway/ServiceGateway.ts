export class ServiceGateway {
  private readonly gateways = new Map<string, Gateway>();
  private readonly manager: GatewayManager;

  routeRequest(request: GatewayRequest): GatewayResult {
    const routed = this.processRouting(request);
    return this.generateRoutingReport(routed);
  }
}
