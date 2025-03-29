export class MetricsAggregator {
  private readonly metricsBuffer: MetricsBuffer = new Map();
  private readonly aggregationRules: AggregationRule[];

  aggregateMetrics(
    rawMetrics: RawMetric[],
    timeframe: TimeFrame
  ): AggregatedMetrics {
    const filtered = this.filterMetrics(rawMetrics, timeframe);
    const processed = this.processMetrics(filtered);

    return this.generateAggregation(processed);
  }
}
