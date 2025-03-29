export class AccessibilityDocumentation {
  private readonly guidelines = new Map<string, AccessibilityDoc>();
  private readonly generator: DocGenerator;

  generateAccessibilityDoc(config: DocConfig): DocResult {
    const generated = this.processAccessibility(config);
    return this.generateDocReport(generated);
  }
}
