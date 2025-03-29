export class ReleaseNotesDocumentation {
  private readonly releases = new Map<string, ReleaseNotesDoc>();
  private readonly generator: DocGenerator;

  generateReleaseNotesDoc(config: DocConfig): DocResult {
    const generated = this.processReleaseNotes(config);
    return this.generateDocReport(generated);
  }
}
