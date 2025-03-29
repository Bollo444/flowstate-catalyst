export class CoreBalanceManager {
  private readonly balancers = new Map<string, BalanceHandler>();
  private readonly manager: BalanceManager;

  manageBalance(request: BalanceRequest): BalanceResult {
    const managed = this.processBalance(request);
    return this.generateBalanceReport(managed);
  }
}
