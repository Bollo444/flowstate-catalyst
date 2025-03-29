export class CoreCompactionManager {
  private readonly compactors = new Map<string, Compactor>();
  private readonly manager: CompactionManager;

  manageCompaction(data: CompactableData): CompactionResult {
    const compacted = this.processCompaction(data);
    return this.generateCompactionReport(compacted);
  }
}
