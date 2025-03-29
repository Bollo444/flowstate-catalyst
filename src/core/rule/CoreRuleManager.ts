export class CoreRuleManager {
  private readonly rules = new Map<string, RuleHandler>();
  private readonly manager: RuleManager;

  manageRule(request: RuleRequest): RuleResult {
    const managed = this.processRule(request);
    return this.generateRuleReport(managed);
  }
}
