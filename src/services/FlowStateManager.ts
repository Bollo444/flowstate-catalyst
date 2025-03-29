export class FlowStateManager {
  private currentState: FlowState;
  private stateHistory: FlowStateTransition[] = [];
  private readonly stateRules: StateTransitionRules;

  constructor(initialState: FlowState) {
    this.currentState = initialState;
    this.stateRules = this.initializeStateRules();
  }

  updateState(metrics: ActivityMetrics): FlowState {
    const nextState = this.calculateNextState(metrics);
    const transition = this.createTransition(nextState);

    this.stateHistory.push(transition);
    this.currentState = nextState;

    return nextState;
  }

  private calculateNextState(metrics: ActivityMetrics): FlowState {
    const score = FlowCalculator.calculateFlowScore(metrics);
    const status = this.determineFlowStatus(score, metrics);

    return {
      score,
      status,
      activeTime: metrics.activeTime,
      interruptions: metrics.interruptions,
      taskCompletions: metrics.taskCompletions,
    };
  }

  private determineFlowStatus(
    score: number,
    metrics: ActivityMetrics
  ): FlowStatus {
    const currentRule = this.stateRules[this.currentState.status];
    const possibleTransitions = currentRule.transitions;

    return (
      possibleTransitions
        .filter((t) => this.meetsTransitionCriteria(t, score, metrics))
        .sort((a, b) => b.priority - a.priority)[0]?.to ||
      this.currentState.status
    );
  }

  private initializeStateRules(): StateTransitionRules {
    return {
      inactive: {
        transitions: [{ to: "building", threshold: 30, priority: 1 }],
      },
      building: {
        transitions: [
          { to: "flow", threshold: 70, priority: 2 },
          { to: "rest", threshold: 20, priority: 1 },
        ],
      },
      flow: {
        transitions: [
          { to: "peak", threshold: 85, priority: 3 },
          { to: "building", threshold: 60, priority: 1 },
        ],
      },
      peak: {
        transitions: [{ to: "flow", threshold: 75, priority: 1 }],
      },
      rest: {
        transitions: [{ to: "building", threshold: 40, priority: 1 }],
      },
    };
  }
}
