export class ErrorManager {
  private readonly errors = new Map<string, ErrorConfig>();
  private readonly system: SystemManager;

  manageError(config: SystemConfig): SystemResult {
    const managed = this.processError(config);
    return this.generateErrorReport(managed);
  }
}
