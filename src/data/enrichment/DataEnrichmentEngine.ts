export class DataEnrichmentEngine {
  private readonly enrichers = new Map<string, DataEnricher>();
  private readonly engine: EnrichmentEngine;

  enrichData(data: EnrichableData): EnrichmentResult {
    const enriched = this.processEnrichment(data);
    return this.generateEnrichmentReport(enriched);
  }
}
