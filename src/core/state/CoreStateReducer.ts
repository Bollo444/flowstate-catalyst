export class CoreStateReducer {
  private readonly reducers = new Map<string, StateReducer>();
  private readonly engine: ReducerEngine;

  reduceState(state: State, action: Action): ReducerResult {
    const reduced = this.executeReducer(state, action);
    return this.generateReducerReport(reduced);
  }
}
