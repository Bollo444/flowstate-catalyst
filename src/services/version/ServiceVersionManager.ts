export class ServiceVersionManager {
  private readonly versions = new Map<string, VersionHandler>();
  private readonly manager: VersionManager;

  manageVersion(request: VersionRequest): VersionResult {
    const managed = this.processVersion(request);
    return this.generateVersionReport(managed);
  }
}
