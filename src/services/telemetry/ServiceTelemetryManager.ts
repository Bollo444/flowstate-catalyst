export class ServiceTelemetryManager {
  private readonly telemetry = new Map<string, TelemetryHandler>();
  private readonly manager: TelemetryManager;

  manageTelemetry(request: TelemetryRequest): TelemetryResult {
    const managed = this.processTelemetry(request);
    return this.generateTelemetryReport(managed);
  }
}
