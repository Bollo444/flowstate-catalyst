export class ServiceTransactionManager {
  private readonly transactions = new Map<string, TransactionHandler>();
  private readonly manager: TransactionManager;

  manageTransaction(request: TransactionRequest): TransactionResult {
    const processed = this.processTransaction(request);
    return this.generateTransactionReport(processed);
  }
}
