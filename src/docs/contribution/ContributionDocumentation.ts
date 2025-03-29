export class ContributionDocumentation {
  private readonly guidelines = new Map<string, ContributionDoc>();
  private readonly generator: DocGenerator;

  generateContributionDoc(config: DocConfig): DocResult {
    const generated = this.processContribution(config);
    return this.generateDocReport(generated);
  }
}
