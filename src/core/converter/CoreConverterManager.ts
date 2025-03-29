export class CoreConverterManager {
  private readonly converters = new Map<string, ConvertHandler>();
  private readonly manager: ConvertManager;

  manageConvert(request: ConvertRequest): ConvertResult {
    const managed = this.processConvert(request);
    return this.generateConvertReport(managed);
  }
}
