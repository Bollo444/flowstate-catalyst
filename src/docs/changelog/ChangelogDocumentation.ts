export class ChangelogDocumentation {
  private readonly changes = new Map<string, ChangelogDoc>();
  private readonly generator: DocGenerator;

  generateChangelogDoc(config: DocConfig): DocResult {
    const generated = this.processChangelog(config);
    return this.generateDocReport(generated);
  }
}
