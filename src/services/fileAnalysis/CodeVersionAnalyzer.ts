export class CodeVersionAnalyzer {
  private readonly versionMetrics = new Map<string, VersionMetric>();
  private readonly analyzer: VersionEngine;

  analyzeVersions(repository: Repository): VersionReport {
    const versions = this.trackVersionHistory(repository);
    return this.generateVersionReport(versions);
  }
}
