export class TroubleshootingDocumentation {
  private readonly guides = new Map<string, TroubleshootingDoc>();
  private readonly generator: DocGenerator;

  generateTroubleshootingDoc(config: DocConfig): DocResult {
    const generated = this.processTroubleshooting(config);
    return this.generateDocReport(generated);
  }
}
