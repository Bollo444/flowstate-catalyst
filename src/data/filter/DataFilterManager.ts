export class DataFilterManager {
  private readonly filters = new Map<string, DataFilter>();
  private readonly manager: FilterManager;

  manageFilter(data: FilterableData): FilterResult {
    const filtered = this.processFilter(data);
    return this.generateFilterReport(filtered);
  }
}
