export class ComputeIntegration {
  private readonly computers = new Map<string, ComputeHandler>();
  private readonly manager: ComputeManager;

  integrateCompute(request: ComputeRequest): ComputeResult {
    const integrated = this.processCompute(request);
    return this.generateComputeReport(integrated);
  }
}
