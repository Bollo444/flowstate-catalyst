export class CoreFailoverHandler {
  private readonly failovers = new Map<string, Failover>();
  private readonly handler: FailoverHandler;

  handleFailover(context: FailoverContext): FailoverResult {
    const handled = this.processFailover(context);
    return this.generateFailoverReport(handled);
  }
}
