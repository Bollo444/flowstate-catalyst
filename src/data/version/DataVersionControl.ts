export class DataVersionControl {
  private readonly versions = new Map<string, Version>();
  private readonly controller: VersionController;

  versionData(data: VersionableData): VersionResult {
    const versioned = this.processVersioning(data);
    return this.generateVersionReport(versioned);
  }
}
