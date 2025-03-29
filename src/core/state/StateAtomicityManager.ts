export class StateAtomicityManager {
  private readonly atomicOperations = new Map<string, AtomicOperation>();
  private readonly manager: AtomicityManager;

  ensureAtomicity(operation: StateOperation): AtomicityResult {
    const ensured = this.processAtomicOperation(operation);
    return this.generateAtomicityReport(ensured);
  }
}
