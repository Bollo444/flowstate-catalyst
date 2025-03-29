export class Pagination {
  private readonly paginationData = new Map<string, PaginationConfig>();
  private readonly manager: UIManager;

  renderPagination(config: UIConfig): UIResult {
    const rendered = this.processPagination(config);
    return this.generatePaginationReport(rendered);
  }
}
