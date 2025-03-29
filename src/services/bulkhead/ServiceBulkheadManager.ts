export class ServiceBulkheadManager {
  private readonly bulkheads = new Map<string, BulkheadHandler>();
  private readonly manager: BulkheadManager;

  manageBulkhead(request: BulkheadRequest): BulkheadResult {
    const managed = this.processBulkhead(request);
    return this.generateBulkheadReport(managed);
  }
}
