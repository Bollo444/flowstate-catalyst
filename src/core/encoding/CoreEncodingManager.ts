export class CoreEncodingManager {
  private readonly encoders = new Map<string, EncodingHandler>();
  private readonly manager: EncodingManager;

  manageEncoding(request: EncodingRequest): EncodingResult {
    const managed = this.processEncoding(request);
    return this.generateEncodingReport(managed);
  }
}
