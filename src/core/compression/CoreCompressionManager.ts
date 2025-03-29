export class CoreCompressionManager {
  private readonly compressors = new Map<string, CompressionHandler>();
  private readonly manager: CompressionManager;

  manageCompression(request: CompressionRequest): CompressionResult {
    const managed = this.processCompression(request);
    return this.generateCompressionReport(managed);
  }
}
