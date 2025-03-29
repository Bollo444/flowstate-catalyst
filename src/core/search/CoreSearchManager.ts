export class CoreSearchManager {
  private readonly searchers = new Map<string, SearchHandler>();
  private readonly manager: SearchManager;

  manageSearch(request: SearchRequest): SearchResult {
    const managed = this.processSearch(request);
    return this.generateSearchReport(managed);
  }
}
