export class CoreHistoryManager {
  private readonly historians = new Map<string, HistoryHandler>();
  private readonly manager: HistoryManager;

  manageHistory(request: HistoryRequest): HistoryResult {
    const managed = this.processHistory(request);
    return this.generateHistoryReport(managed);
  }
}
