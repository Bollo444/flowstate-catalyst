export class CoreIsolationHandler {
  private readonly isolators = new Map<string, Isolator>();
  private readonly handler: IsolationHandler;

  handleIsolation(context: IsolationContext): IsolationResult {
    const isolated = this.processIsolation(context);
    return this.generateIsolationReport(isolated);
  }
}
