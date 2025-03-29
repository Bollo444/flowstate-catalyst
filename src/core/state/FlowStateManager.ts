export class FlowStateManager {
  private readonly stateStore = new Map<string, FlowState>();
  private readonly stateEngine: StateEngine;

  manageFlowState(context: FlowContext): FlowStateResult {
    const currentState = this.calculateFlowState(context);
    return this.updateFlowState(currentState);
  }
}
