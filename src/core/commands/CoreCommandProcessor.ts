export class CoreCommandProcessor {
  private readonly processors = new Map<string, CommandProcessor>();
  private readonly engine: ProcessorEngine;

  processCommand(command: Command): ProcessingResult {
    const processed = this.executeCommand(command);
    return this.generateProcessingReport(processed);
  }
}
