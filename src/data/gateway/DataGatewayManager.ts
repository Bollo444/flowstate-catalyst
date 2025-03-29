export class DataGatewayManager {
  private readonly gateways = new Map<string, GatewayHandler>();
  private readonly manager: GatewaySystem;

  manageGateway(data: GatewayData): GatewayResult {
    const managed = this.processGateway(data);
    return this.generateGatewayReport(managed);
  }
}
