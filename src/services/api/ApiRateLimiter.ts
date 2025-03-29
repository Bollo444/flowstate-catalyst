export class ApiRateLimiter {
  private readonly rateLimits = new Map<string, RateLimit>();
  private readonly limiter: RateLimiter;

  enforceRateLimit(request: ApiRequest): RateLimitResult {
    const limit = this.checkRateLimit(request);
    return this.generateLimitResponse(limit);
  }
}
