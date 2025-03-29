export class StateCompositionEngine {
  private readonly composers = new Map<string, StateComposer>();
  private readonly engine: CompositionEngine;

  composeState(components: StateComponent[]): CompositionResult {
    const composed = this.performComposition(components);
    return this.generateCompositionReport(composed);
  }
}
