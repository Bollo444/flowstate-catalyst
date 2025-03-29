export class CodeArchitectureAnalyzer {
  private readonly architecturePatterns = new Map<
    string,
    ArchitecturePattern
  >();
  private readonly analyzer: ArchitectureEngine;

  analyzeArchitecture(files: ProjectFile[]): ArchitectureReport {
    const architecture = this.assessArchitecture(files);
    return this.generateArchitectureReport(architecture);
  }
}
