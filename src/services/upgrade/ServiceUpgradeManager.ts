export class ServiceUpgradeManager {
  private readonly upgraders = new Map<string, UpgradeHandler>();
  private readonly manager: UpgradeManager;

  manageUpgrade(request: UpgradeRequest): UpgradeResult {
    const managed = this.processUpgrade(request);
    return this.generateUpgradeReport(managed);
  }
}
