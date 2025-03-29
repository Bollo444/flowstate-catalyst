export class CoreThrottleManager {
  private readonly throttlers = new Map<string, ThrottleHandler>();
  private readonly manager: ThrottleManager;

  manageThrottle(request: ThrottleRequest): ThrottleResult {
    const managed = this.processThrottle(request);
    return this.generateThrottleReport(managed);
  }
}
