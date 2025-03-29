export class ServiceRedundancyManager {
  private readonly redundants = new Map<string, RedundancyHandler>();
  private readonly manager: RedundancyManager;

  manageRedundancy(request: RedundancyRequest): RedundancyResult {
    const managed = this.processRedundancy(request);
    return this.generateRedundancyReport(managed);
  }
}
