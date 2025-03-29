export class StateHistoryTracker {
  private readonly history = new Map<string, StateHistory>();
  private readonly tracker: HistoryTracker;

  trackStateChanges(state: State): HistoryResult {
    const tracked = this.recordStateChange(state);
    return this.generateHistoryReport(tracked);
  }
}
