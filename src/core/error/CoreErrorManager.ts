export class CoreErrorManager {
  private readonly handlers = new Map<string, ErrorHandler>();
  private readonly manager: ErrorManager;

  manageError(error: ErrorRequest): ErrorResult {
    const managed = this.processError(error);
    return this.generateErrorReport(managed);
  }
}
