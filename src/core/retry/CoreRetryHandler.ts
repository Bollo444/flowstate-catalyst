export class CoreRetryHandler {
  private readonly retriers = new Map<string, Retrier>();
  private readonly handler: RetryHandler;

  handleRetry(operation: RetryableOperation): RetryResult {
    const retried = this.executeRetry(operation);
    return this.generateRetryReport(retried);
  }
}
