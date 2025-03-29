export class DataStateManager {
  private readonly stateStore = new Map<string, DataState>();
  private readonly manager: StateManager;

  manageDataState(data: DataContext): DataStateResult {
    const state = this.processDataState(data);
    return this.generateStateReport(state);
  }
}
