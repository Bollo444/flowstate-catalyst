export class ServiceFallbackManager {
  private readonly fallbacks = new Map<string, FallbackHandler>();
  private readonly manager: FallbackManager;

  handleFallback(request: FallbackRequest): FallbackResult {
    const handled = this.processFallback(request);
    return this.generateFallbackReport(handled);
  }
}
