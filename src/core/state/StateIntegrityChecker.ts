export class StateIntegrityChecker {
  private readonly checkers = new Map<string, IntegrityChecker>();
  private readonly engine: CheckerEngine;

  checkIntegrity(state: State): IntegrityResult {
    const checked = this.verifyIntegrity(state);
    return this.generateIntegrityReport(checked);
  }
}
