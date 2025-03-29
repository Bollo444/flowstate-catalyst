export class CoreUtilizationManager {
  private readonly utilizers = new Map<string, UtilizationHandler>();
  private readonly manager: UtilizationManager;

  manageUtilization(request: UtilizationRequest): UtilizationResult {
    const managed = this.processUtilization(request);
    return this.generateUtilizationReport(managed);
  }
}
