export class CoreRateManager {
  private readonly raters = new Map<string, RateHandler>();
  private readonly manager: RateManager;

  manageRate(request: RateRequest): RateResult {
    const managed = this.processRate(request);
    return this.generateRateReport(managed);
  }
}
