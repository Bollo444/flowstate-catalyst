export class CoreOptimizationManager {
  private readonly optimizers = new Map<string, OptimizationHandler>();
  private readonly manager: OptimizationManager;

  manageOptimization(request: OptimizationRequest): OptimizationResult {
    const managed = this.processOptimization(request);
    return this.generateOptimizationReport(managed);
  }
}
