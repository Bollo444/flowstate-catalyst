export class ApiErrorHandler {
  private readonly errorPatterns = new Map<string, ErrorPattern>();
  private readonly handler: ErrorHandler;

  handleError(error: ApiError): ErrorResponse {
    const handled = this.processError(error);
    return this.generateErrorResponse(handled);
  }
}
