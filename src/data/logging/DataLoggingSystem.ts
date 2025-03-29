export class DataLoggingSystem {
  private readonly loggers = new Map<string, DataLogger>();
  private readonly system: LoggingSystem;

  logData(data: LoggableData): LoggingResult {
    const logged = this.processLogging(data);
    return this.generateLoggingReport(logged);
  }
}
