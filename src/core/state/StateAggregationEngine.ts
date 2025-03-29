export class StateAggregationEngine {
  private readonly aggregators = new Map<string, StateAggregator>();
  private readonly engine: AggregationEngine;

  aggregateState(states: State[]): AggregationResult {
    const aggregated = this.performAggregation(states);
    return this.generateAggregationReport(aggregated);
  }
}
