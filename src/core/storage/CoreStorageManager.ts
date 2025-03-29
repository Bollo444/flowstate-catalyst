export class CoreStorageManager {
  private readonly storages = new Map<string, StorageHandler>();
  private readonly manager: StorageManager;

  manageStorage(request: StorageRequest): StorageResult {
    const managed = this.processStorage(request);
    return this.generateStorageReport(managed);
  }
}
