export class ServiceRetryManager {
  private readonly retriers = new Map<string, RetryHandler>();
  private readonly manager: RetryManager;

  handleRetry(request: RetryRequest): RetryResult {
    const retried = this.processRetry(request);
    return this.generateRetryReport(retried);
  }
}
