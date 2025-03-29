export class DataExtractionEngine {
  private readonly extractors = new Map<string, DataExtractor>();
  private readonly engine: ExtractionEngine;

  extractData(data: ExtractableData): ExtractionResult {
    const extracted = this.processExtraction(data);
    return this.generateExtractionReport(extracted);
  }
}
