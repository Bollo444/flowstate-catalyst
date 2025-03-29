export class ApiGatewayService {
  private readonly routes = new Map<string, RouteConfig>();
  private readonly gateway: Gateway;

  routeRequest(request: ApiRequest): GatewayResponse {
    const routed = this.processRoute(request);
    return this.generateRouteResponse(routed);
  }
}
