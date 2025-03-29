export class CoreLogManager {
  private readonly loggers = new Map<string, LogHandler>();
  private readonly manager: LogManager;

  manageLog(request: LogRequest): LogResult {
    const managed = this.processLog(request);
    return this.generateLogReport(managed);
  }
}
