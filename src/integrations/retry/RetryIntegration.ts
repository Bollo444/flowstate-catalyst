export class RetryIntegration {
  private readonly retriers = new Map<string, RetryHandler>();
  private readonly manager: RetryManager;

  integrateRetry(request: RetryRequest): RetryResult {
    const integrated = this.processRetry(request);
    return this.generateRetryReport(integrated);
  }
}
