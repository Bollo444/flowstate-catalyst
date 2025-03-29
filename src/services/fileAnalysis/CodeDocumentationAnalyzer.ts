export class CodeDocumentationAnalyzer {
  private readonly documentationMetrics = new Map<
    string,
    DocumentationMetric
  >();
  private readonly analyzer: DocumentationEngine;

  analyzeDocumentation(code: SourceCode): DocumentationReport {
    const documentation = this.assessDocumentation(code);
    return this.generateDocumentationReport(documentation);
  }
}
