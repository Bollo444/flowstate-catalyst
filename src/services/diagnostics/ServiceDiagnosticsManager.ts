export class ServiceDiagnosticsManager {
  private readonly diagnostics = new Map<string, DiagnosticsHandler>();
  private readonly manager: DiagnosticsManager;

  manageDiagnostics(request: DiagnosticsRequest): DiagnosticsResult {
    const managed = this.processDiagnostics(request);
    return this.generateDiagnosticsReport(managed);
  }
}
