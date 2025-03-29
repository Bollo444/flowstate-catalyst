export class StateValidationEngine {
  private readonly validators = new Map<string, StateValidator>();
  private readonly engine: ValidationEngine;

  validateState(state: State): ValidationResult {
    const validation = this.performValidation(state);
    return this.generateValidationReport(validation);
  }
}
