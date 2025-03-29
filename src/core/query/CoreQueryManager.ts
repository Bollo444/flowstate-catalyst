export class CoreQueryManager {
  private readonly queriers = new Map<string, QueryHandler>();
  private readonly manager: QueryManager;

  manageQuery(request: QueryRequest): QueryResult {
    const managed = this.processQuery(request);
    return this.generateQueryReport(managed);
  }
}
