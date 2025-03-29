export class DatabaseDocumentation {
  private readonly schemas = new Map<string, DatabaseDoc>();
  private readonly generator: DocGenerator;

  generateDatabaseDoc(config: DocConfig): DocResult {
    const generated = this.processDatabase(config);
    return this.generateDocReport(generated);
  }
}
