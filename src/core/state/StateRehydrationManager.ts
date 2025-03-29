export class StateRehydrationManager {
  private readonly rehydrators = new Map<string, Rehydrator>();
  private readonly manager: RehydrationManager;

  rehydrateState(snapshot: StateSnapshot): RehydrationResult {
    const rehydrated = this.processRehydration(snapshot);
    return this.generateRehydrationReport(rehydrated);
  }
}
