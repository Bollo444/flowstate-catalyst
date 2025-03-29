export class AuditDocumentation {
  private readonly trails = new Map<string, AuditDoc>();
  private readonly generator: DocGenerator;

  generateAuditDoc(config: DocConfig): DocResult {
    const generated = this.processAudit(config);
    return this.generateDocReport(generated);
  }
}
