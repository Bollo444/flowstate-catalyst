export class CoreErrorHandler {
  private readonly handlers = new Map<string, ErrorHandler>();
  private readonly engine: ErrorEngine;

  handleError(error: CoreError): ErrorResult {
    const handled = this.processError(error);
    return this.generateErrorReport(handled);
  }
}
