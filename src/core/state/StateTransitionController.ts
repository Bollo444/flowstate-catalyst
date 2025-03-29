export class StateTransitionController {
  private readonly transitionRules = new Map<string, TransitionRule>();
  private readonly controller: TransitionController;

  handleTransition(from: State, to: State): TransitionResult {
    const transition = this.validateTransition(from, to);
    return this.executeTransition(transition);
  }
}
