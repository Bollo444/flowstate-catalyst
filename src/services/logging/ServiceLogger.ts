export class ServiceLogger {
  private readonly loggers = new Map<string, Logger>();
  private readonly manager: LogManager;

  logService(data: LogData): LogResult {
    const logged = this.processLogging(data);
    return this.generateLogReport(logged);
  }
}
