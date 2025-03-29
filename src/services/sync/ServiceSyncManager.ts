export class ServiceSyncManager {
  private readonly syncs = new Map<string, SyncHandler>();
  private readonly manager: SyncManager;

  manageSync(request: SyncRequest): SyncResult {
    const managed = this.processSync(request);
    return this.generateSyncReport(managed);
  }
}
