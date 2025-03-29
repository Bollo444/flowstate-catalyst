export class UpgradeDocumentation {
  private readonly procedures = new Map<string, UpgradeDoc>();
  private readonly generator: DocGenerator;

  generateUpgradeDoc(config: DocConfig): DocResult {
    const generated = this.processUpgrade(config);
    return this.generateDocReport(generated);
  }
}
