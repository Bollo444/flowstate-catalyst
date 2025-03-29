export class ErrorIntegration {
  private readonly handlers = new Map<string, ErrorHandler>();
  private readonly manager: ErrorManager;

  integrateError(request: ErrorRequest): ErrorResult {
    const integrated = this.processError(request);
    return this.generateErrorReport(integrated);
  }
}
