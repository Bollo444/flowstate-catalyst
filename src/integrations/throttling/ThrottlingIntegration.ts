export class ThrottlingIntegration {
  private readonly throttlers = new Map<string, ThrottlingHandler>();
  private readonly manager: ThrottlingManager;

  integrateThrottling(request: ThrottlingRequest): ThrottlingResult {
    const integrated = this.processThrottling(request);
    return this.generateThrottlingReport(integrated);
  }
}
