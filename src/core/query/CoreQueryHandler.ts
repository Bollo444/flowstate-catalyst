export class CoreQueryHandler {
  private readonly handlers = new Map<string, QueryHandler>();
  private readonly engine: QueryEngine;

  handleQuery(query: Query): QueryResult {
    const handled = this.processQuery(query);
    return this.generateQueryReport(handled);
  }
}
