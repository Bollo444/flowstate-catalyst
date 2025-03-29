export class InterruptionHandler {
  private readonly recoveryStrategies = new Map<string, RecoveryStrategy>();
  private readonly interruptionLog: InterruptionRecord[] = [];

  handleInterruption(type: string, context: FlowContext): RecoveryPlan {
    const strategy = this.getRecoveryStrategy(type);
    const impact = this.calculateImpact(context);

    const plan = {
      recoveryTime: this.estimateRecoveryTime(type, impact),
      steps: strategy.generateSteps(context),
      adjustments: this.calculateStateAdjustments(impact),
    };

    this.logInterruption(type, impact, plan);
    return plan;
  }
}
