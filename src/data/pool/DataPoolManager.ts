export class DataPoolManager {
  private readonly pools = new Map<string, DataPool>();
  private readonly manager: PoolManager;

  managePool(data: PoolableData): PoolResult {
    const pooled = this.processPool(data);
    return this.generatePoolReport(pooled);
  }
}
