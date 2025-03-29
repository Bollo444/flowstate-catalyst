export class ServiceRecoveryManager {
  private readonly recoveries = new Map<string, RecoveryHandler>();
  private readonly manager: RecoveryManager;

  manageRecovery(request: RecoveryRequest): RecoveryResult {
    const managed = this.processRecovery(request);
    return this.generateRecoveryReport(managed);
  }
}
