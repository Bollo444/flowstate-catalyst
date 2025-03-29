export class ApiVersionManager {
  private readonly versions = new Map<string, VersionConfig>();
  private readonly manager: VersionManager;

  manageVersion(version: ApiVersion): VersionResponse {
    const managed = this.processVersion(version);
    return this.generateVersionResponse(managed);
  }
}
