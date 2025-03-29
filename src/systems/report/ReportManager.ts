export class ReportManager {
  private readonly reports = new Map<string, ReportConfig>();
  private readonly system: SystemManager;

  manageReport(config: SystemConfig): SystemResult {
    const managed = this.processReport(config);
    return this.generateReportReport(managed);
  }
}
