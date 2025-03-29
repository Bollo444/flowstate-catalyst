export class CoreTraceManager {
  private readonly tracers = new Map<string, TraceHandler>();
  private readonly manager: TraceManager;

  manageTrace(request: TraceRequest): TraceResult {
    const managed = this.processTrace(request);
    return this.generateTraceReport(managed);
  }
}
