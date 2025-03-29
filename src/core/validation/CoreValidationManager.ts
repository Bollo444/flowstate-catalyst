export class CoreValidationManager {
  private readonly validators = new Map<string, ValidationHandler>();
  private readonly manager: ValidationManager;

  validate(request: ValidationRequest): ValidationResult {
    const validated = this.processValidation(request);
    return this.generateValidationReport(validated);
  }
}
