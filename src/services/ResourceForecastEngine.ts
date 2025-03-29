export class ResourceForecastEngine {
  private readonly forecastMetrics = new Map<string, ForecastMetrics>();
  private readonly engine: ForecastEngine;

  generateForecast(resources: Resource[], timeline: Timeline): ForecastReport {
    const forecast = this.calculateResourceForecast(resources, timeline);
    return this.generateForecastReport(forecast);
  }
}
