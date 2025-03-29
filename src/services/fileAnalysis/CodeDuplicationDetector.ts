export class CodeDuplicationDetector {
  private readonly duplicationPatterns = new Map<string, DuplicationPattern>();
  private readonly detector: DuplicationEngine;

  detectDuplication(files: ProjectFile[]): DuplicationReport {
    const duplicates = this.findDuplicates(files);
    return this.generateDuplicationReport(duplicates);
  }
}
