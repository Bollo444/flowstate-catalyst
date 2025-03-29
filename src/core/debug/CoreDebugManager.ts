export class CoreDebugManager {
  private readonly debuggers = new Map<string, DebugHandler>();
  private readonly manager: DebugManager;

  manageDebug(request: DebugRequest): DebugResult {
    const managed = this.processDebug(request);
    return this.generateDebugReport(managed);
  }
}
