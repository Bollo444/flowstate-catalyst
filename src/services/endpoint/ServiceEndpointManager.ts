export class ServiceEndpointManager {
  private readonly endpoints = new Map<string, EndpointHandler>();
  private readonly manager: EndpointManager;

  manageEndpoint(request: EndpointRequest): EndpointResult {
    const managed = this.processEndpoint(request);
    return this.generateEndpointReport(managed);
  }
}
