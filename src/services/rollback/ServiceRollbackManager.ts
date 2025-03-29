export class ServiceRollbackManager {
  private readonly rollbacks = new Map<string, RollbackHandler>();
  private readonly manager: RollbackManager;

  manageRollback(request: RollbackRequest): RollbackResult {
    const managed = this.processRollback(request);
    return this.generateRollbackReport(managed);
  }
}
