export class CoreStateManager {
  private readonly states = new Map<string, StateHandler>();
  private readonly manager: StateManager;

  manageState(request: StateRequest): StateResult {
    const managed = this.processState(request);
    return this.generateStateReport(managed);
  }
}
