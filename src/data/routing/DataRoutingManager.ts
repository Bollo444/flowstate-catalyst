export class DataRoutingManager {
  private readonly routes = new Map<string, DataRoute>();
  private readonly manager: RoutingManager;

  manageRoute(data: RoutableData): RoutingResult {
    const routed = this.processRoute(data);
    return this.generateRoutingReport(routed);
  }
}
