export class CoreAuditManager {
  private readonly auditors = new Map<string, AuditHandler>();
  private readonly manager: AuditManager;

  manageAudit(request: AuditRequest): AuditResult {
    const managed = this.processAudit(request);
    return this.generateAuditReport(managed);
  }
}
