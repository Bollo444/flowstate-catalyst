export class DataNormalizer {
  private readonly normalizers = new Map<string, Normalizer>();
  private readonly engine: NormalizationEngine;

  normalizeData(data: NormalizableData): NormalizationResult {
    const normalized = this.processNormalization(data);
    return this.generateNormalizationReport(normalized);
  }
}
