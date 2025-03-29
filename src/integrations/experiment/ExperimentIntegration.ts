export class ExperimentIntegration {
  private readonly experimenters = new Map<string, ExperimentHandler>();
  private readonly manager: ExperimentManager;

  integrateExperiment(request: ExperimentRequest): ExperimentResult {
    const integrated = this.processExperiment(request);
    return this.generateExperimentReport(integrated);
  }
}
