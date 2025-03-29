export class ServiceTracer {
  private readonly tracers = new Map<string, Tracer>();
  private readonly manager: TracingManager;

  traceService(request: TraceRequest): TraceResult {
    const traced = this.processTracing(request);
    return this.generateTraceReport(traced);
  }
}
