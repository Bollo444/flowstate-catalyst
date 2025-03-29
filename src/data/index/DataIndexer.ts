export class DataIndexer {
  private readonly indices = new Map<string, DataIndex>();
  private readonly engine: IndexEngine;

  indexData(data: IndexableData): IndexResult {
    const indexed = this.processIndexing(data);
    return this.generateIndexReport(indexed);
  }
}
