export class CoreResourceManager {
  private readonly resources = new Map<string, ResourceHandler>();
  private readonly manager: ResourceManager;

  manageResource(request: ResourceRequest): ResourceResult {
    const managed = this.processResource(request);
    return this.generateResourceReport(managed);
  }
}
