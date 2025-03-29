export class CoreVersionManager {
  private readonly versioners = new Map<string, VersionHandler>();
  private readonly manager: VersionManager;

  manageVersion(request: VersionRequest): VersionResult {
    const managed = this.processVersion(request);
    return this.generateVersionReport(managed);
  }
}
