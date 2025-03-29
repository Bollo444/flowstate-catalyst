export class CoreFencingManager {
  private readonly fences = new Map<string, Fence>();
  private readonly manager: FencingManager;

  manageFencing(context: FencingContext): FencingResult {
    const fenced = this.processFencing(context);
    return this.generateFencingReport(fenced);
  }
}
