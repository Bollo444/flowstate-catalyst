export class ComplianceDocumentation {
  private readonly requirements = new Map<string, ComplianceDoc>();
  private readonly generator: DocGenerator;

  generateComplianceDoc(config: DocConfig): DocResult {
    const generated = this.processCompliance(config);
    return this.generateDocReport(generated);
  }
}
