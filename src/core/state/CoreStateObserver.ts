export class CoreStateObserver {
  private readonly observers = new Map<string, StateObserver>();
  private readonly engine: ObserverEngine;

  observeState(state: State): ObservationResult {
    const observed = this.monitorStateChanges(state);
    return this.generateObservationReport(observed);
  }
}
