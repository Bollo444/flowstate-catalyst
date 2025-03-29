export class ServiceReliabilityManager {
  private readonly reliables = new Map<string, ReliabilityHandler>();
  private readonly manager: ReliabilityManager;

  manageReliability(request: ReliabilityRequest): ReliabilityResult {
    const managed = this.processReliability(request);
    return this.generateReliabilityReport(managed);
  }
}
