export class CoreIndexManager {
  private readonly indexers = new Map<string, IndexHandler>();
  private readonly manager: IndexManager;

  manageIndex(request: IndexRequest): IndexResult {
    const managed = this.processIndex(request);
    return this.generateIndexReport(managed);
  }
}
