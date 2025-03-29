export class CoreScaleManager {
  private readonly scalers = new Map<string, ScaleHandler>();
  private readonly manager: ScaleManager;

  manageScale(request: ScaleRequest): ScaleResult {
    const managed = this.processScale(request);
    return this.generateScaleReport(managed);
  }
}
