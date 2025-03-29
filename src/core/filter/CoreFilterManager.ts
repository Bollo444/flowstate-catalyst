export class CoreFilterManager {
  private readonly filters = new Map<string, FilterHandler>();
  private readonly manager: FilterManager;

  manageFilter(request: FilterRequest): FilterResult {
    const managed = this.processFilter(request);
    return this.generateFilterReport(managed);
  }
}
