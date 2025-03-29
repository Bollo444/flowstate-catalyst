export class ApiResponseFormatter {
  private readonly formatters = new Map<string, ResponseFormatter>();
  private readonly engine: FormattingEngine;

  formatResponse(data: ResponseData, format: FormatType): FormattedResponse {
    const formatted = this.applyFormatting(data, format);
    return this.generateResponse(formatted);
  }
}
