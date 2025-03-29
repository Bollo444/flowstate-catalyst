export class FlowStateTransitioner {
  private readonly transitionRules: TransitionRule[];
  private readonly stateHistory: StateTransition[] = [];

  calculateNextState(
    currentState: FlowState,
    metrics: ActivityMetrics
  ): FlowState {
    const validTransitions = this.getValidTransitions(currentState);
    const nextState = this.determineOptimalTransition(
      validTransitions,
      metrics
    );

    this.recordTransition(currentState, nextState);
    return nextState;
  }
}
