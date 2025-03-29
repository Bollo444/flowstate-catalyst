export class DataBufferManager {
  private readonly buffers = new Map<string, DataBuffer>();
  private readonly manager: BufferManager;

  manageBuffer(data: BufferableData): BufferResult {
    const buffered = this.processBuffer(data);
    return this.generateBufferReport(buffered);
  }
}
