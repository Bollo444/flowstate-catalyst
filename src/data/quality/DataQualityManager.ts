export class DataQualityManager {
  private readonly qualityChecks = new Map<string, QualityCheck>();
  private readonly manager: QualityManager;

  checkQuality(data: CheckableData): QualityResult {
    const checked = this.processQualityCheck(data);
    return this.generateQualityReport(checked);
  }
}
