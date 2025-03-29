export class DataAggregator {
  private readonly aggregators = new Map<string, Aggregator>();
  private readonly engine: AggregationEngine;

  aggregateData(data: AggregatableData): AggregationResult {
    const aggregated = this.processAggregation(data);
    return this.generateAggregationReport(aggregated);
  }
}
