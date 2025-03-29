export class MigrationDocumentation {
  private readonly steps = new Map<string, MigrationDoc>();
  private readonly generator: DocGenerator;

  generateMigrationDoc(config: DocConfig): DocResult {
    const generated = this.processMigration(config);
    return this.generateDocReport(generated);
  }
}
