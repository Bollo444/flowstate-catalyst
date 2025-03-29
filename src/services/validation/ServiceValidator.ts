export class ServiceValidator {
  private readonly validators = new Map<string, Validator>();
  private readonly manager: ValidationManager;

  validate(request: ValidationRequest): ValidationResult {
    const validated = this.processValidation(request);
    return this.generateValidationReport(validated);
  }
}
