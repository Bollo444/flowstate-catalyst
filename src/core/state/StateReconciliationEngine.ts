export class StateReconciliationEngine {
  private readonly reconcilers = new Map<string, StateReconciler>();
  private readonly engine: ReconciliationEngine;

  reconcileState(states: State[]): ReconciliationResult {
    const reconciled = this.performReconciliation(states);
    return this.generateReconciliationReport(reconciled);
  }
}
