export class TutorialDocumentation {
  private readonly tutorials = new Map<string, TutorialDoc>();
  private readonly generator: DocGenerator;

  generateTutorialDoc(config: DocConfig): DocResult {
    const generated = this.processTutorial(config);
    return this.generateDocReport(generated);
  }
}
