export class ServiceRateLimiter {
  private readonly limiters = new Map<string, RateLimiter>();
  private readonly manager: LimiterManager;

  limitRate(request: RateRequest): RateResult {
    const limited = this.processRateLimit(request);
    return this.generateRateReport(limited);
  }
}
