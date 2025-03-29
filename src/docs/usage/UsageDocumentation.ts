export class UsageDocumentation {
  private readonly guides = new Map<string, UsageDoc>();
  private readonly generator: DocGenerator;

  generateUsageDoc(config: DocConfig): DocResult {
    const generated = this.processUsage(config);
    return this.generateDocReport(generated);
  }
}
