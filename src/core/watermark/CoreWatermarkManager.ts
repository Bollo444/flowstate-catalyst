export class CoreWatermarkManager {
  private readonly watermarks = new Map<string, Watermark>();
  private readonly manager: WatermarkManager;

  manageWatermark(stream: DataStream): WatermarkResult {
    const marked = this.processWatermark(stream);
    return this.generateWatermarkReport(marked);
  }
}
