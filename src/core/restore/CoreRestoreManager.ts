export class CoreRestoreManager {
  private readonly restorers = new Map<string, RestoreHandler>();
  private readonly manager: RestoreManager;

  manageRestore(request: RestoreRequest): RestoreResult {
    const managed = this.processRestore(request);
    return this.generateRestoreReport(managed);
  }
}
