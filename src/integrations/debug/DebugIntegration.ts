export class DebugIntegration {
  private readonly debuggers = new Map<string, DebugHandler>();
  private readonly manager: DebugManager;

  integrateDebug(request: DebugRequest): DebugResult {
    const integrated = this.processDebug(request);
    return this.generateDebugReport(integrated);
  }
}
