export class ServiceTimeoutManager {
  private readonly timeouts = new Map<string, TimeoutHandler>();
  private readonly manager: TimeoutManager;

  handleTimeout(request: TimeoutRequest): TimeoutResult {
    const handled = this.processTimeout(request);
    return this.generateTimeoutReport(handled);
  }
}
