export class CoreThrottleController {
  private readonly throttlers = new Map<string, Throttler>();
  private readonly controller: ThrottleController;

  controlThrottle(context: ThrottleContext): ThrottleResult {
    const throttled = this.applyThrottle(context);
    return this.generateThrottleReport(throttled);
  }
}
