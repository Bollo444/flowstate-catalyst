export class DataValidator {
  private readonly validators = new Map<string, Validator>();
  private readonly engine: ValidationEngine;

  validateData(data: ValidatableData): ValidationResult {
    const validated = this.processValidation(data);
    return this.generateValidationReport(validated);
  }
}
