export class StateFencingManager {
  private readonly fences = new Map<string, StateFence>();
  private readonly manager: FencingManager;

  manageFence(state: State): FencingResult {
    const fenced = this.processFence(state);
    return this.generateFencingReport(fenced);
  }
}
