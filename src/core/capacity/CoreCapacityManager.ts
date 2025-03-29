export class CoreCapacityManager {
  private readonly capacities = new Map<string, CapacityHandler>();
  private readonly manager: CapacityManager;

  manageCapacity(request: CapacityRequest): CapacityResult {
    const managed = this.processCapacity(request);
    return this.generateCapacityReport(managed);
  }
}
