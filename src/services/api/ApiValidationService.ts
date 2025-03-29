export class ApiValidationService {
  private readonly validators = new Map<string, Validator>();
  private readonly engine: ValidationEngine;

  validateRequest(
    request: ApiRequest,
    rules: ValidationRules
  ): ValidationResult {
    const validation = this.performValidation(request, rules);
    return this.generateValidationResult(validation);
  }
}
