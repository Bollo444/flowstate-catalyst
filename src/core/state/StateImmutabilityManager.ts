export class StateImmutabilityManager {
  private readonly immutabilityRules = new Map<string, ImmutabilityRule>();
  private readonly manager: ImmutabilityManager;

  enforceImmutability(state: State): ImmutabilityResult {
    const enforced = this.applyImmutabilityRules(state);
    return this.generateImmutabilityReport(enforced);
  }
}
