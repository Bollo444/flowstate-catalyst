export class CoreLimitManager {
  private readonly limiters = new Map<string, LimitHandler>();
  private readonly manager: LimitManager;

  manageLimit(request: LimitRequest): LimitResult {
    const managed = this.processLimit(request);
    return this.generateLimitReport(managed);
  }
}
