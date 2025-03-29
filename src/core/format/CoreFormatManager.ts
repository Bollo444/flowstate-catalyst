export class CoreFormatManager {
  private readonly formatters = new Map<string, FormatHandler>();
  private readonly manager: FormatManager;

  manageFormat(request: FormatRequest): FormatResult {
    const managed = this.processFormat(request);
    return this.generateFormatReport(managed);
  }
}
