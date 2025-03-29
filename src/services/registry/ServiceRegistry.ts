export class ServiceRegistry {
  private readonly services = new Map<string, ServiceDefinition>();
  private readonly registry: RegistryManager;

  registerService(service: ServiceMetadata): RegistrationResult {
    const registered = this.processRegistration(service);
    return this.generateRegistrationReport(registered);
  }
}
