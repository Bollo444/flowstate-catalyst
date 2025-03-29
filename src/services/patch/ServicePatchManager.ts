export class ServicePatchManager {
  private readonly patchers = new Map<string, PatchHandler>();
  private readonly manager: PatchManager;

  managePatch(request: PatchRequest): PatchResult {
    const managed = this.processPatch(request);
    return this.generatePatchReport(managed);
  }
}
