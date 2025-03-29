export class ServiceReportingManager {
  private readonly reporters = new Map<string, ReportHandler>();
  private readonly manager: ReportManager;

  manageReport(request: ReportRequest): ReportResult {
    const managed = this.processReport(request);
    return this.generateReportingReport(managed);
  }
}
