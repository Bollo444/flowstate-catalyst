export class CoreConstraintManager {
  private readonly constraints = new Map<string, ConstraintHandler>();
  private readonly manager: ConstraintManager;

  manageConstraint(request: ConstraintRequest): ConstraintResult {
    const managed = this.processConstraint(request);
    return this.generateConstraintReport(managed);
  }
}
