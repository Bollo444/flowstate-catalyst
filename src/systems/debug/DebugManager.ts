export class DebugManager {
  private readonly debugs = new Map<string, DebugConfig>();
  private readonly system: SystemManager;

  manageDebug(config: SystemConfig): SystemResult {
    const managed = this.processDebug(config);
    return this.generateDebugReport(managed);
  }
}
