export class RecoveryDocumentation {
  private readonly recoveries = new Map<string, RecoveryDoc>();
  private readonly generator: DocGenerator;

  generateRecoveryDoc(config: DocConfig): DocResult {
    const generated = this.processRecovery(config);
    return this.generateDocReport(generated);
  }
}
