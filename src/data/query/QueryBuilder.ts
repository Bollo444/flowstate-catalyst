export class QueryBuilder {
  private readonly queryTemplates = new Map<string, QueryTemplate>();
  private readonly builder: QueryConstructor;

  buildQuery(params: QueryParams): QueryResult {
    const query = this.constructQuery(params);
    return this.validateQuery(query);
  }
}
