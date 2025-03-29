export class CoreSortManager {
  private readonly sorters = new Map<string, SortHandler>();
  private readonly manager: SortManager;

  manageSort(request: SortRequest): SortResult {
    const managed = this.processSort(request);
    return this.generateSortReport(managed);
  }
}
