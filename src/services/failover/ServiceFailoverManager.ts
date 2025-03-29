export class ServiceFailoverManager {
  private readonly failovers = new Map<string, FailoverHandler>();
  private readonly manager: FailoverManager;

  manageFailover(request: FailoverRequest): FailoverResult {
    const managed = this.processFailover(request);
    return this.generateFailoverReport(managed);
  }
}
