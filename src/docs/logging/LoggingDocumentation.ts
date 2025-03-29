export class LoggingDocumentation {
  private readonly loggers = new Map<string, LoggingDoc>();
  private readonly generator: DocGenerator;

  generateLoggingDoc(config: DocConfig): DocResult {
    const generated = this.processLogging(config);
    return this.generateDocReport(generated);
  }
}
