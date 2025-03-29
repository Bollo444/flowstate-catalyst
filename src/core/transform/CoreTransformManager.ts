export class CoreTransformManager {
  private readonly transformers = new Map<string, TransformHandler>();
  private readonly manager: TransformManager;

  manageTransform(request: TransformRequest): TransformResult {
    const managed = this.processTransform(request);
    return this.generateTransformReport(managed);
  }
}
