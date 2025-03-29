export class CoreLoadManager {
  private readonly loaders = new Map<string, LoadHandler>();
  private readonly manager: LoadManager;

  manageLoad(request: LoadRequest): LoadResult {
    const managed = this.processLoad(request);
    return this.generateLoadReport(managed);
  }
}
