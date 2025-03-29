export class CoreEngine {
  private readonly processors = new Map<string, Processor>();
  private readonly engine: ProcessingEngine;

  processCore(request: CoreRequest): CoreResult {
    const processed = this.processRequest(request);
    return this.generateProcessingReport(processed);
  }
}
