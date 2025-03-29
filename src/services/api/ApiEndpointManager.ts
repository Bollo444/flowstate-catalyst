export class ApiEndpointManager {
  private readonly endpointRegistry = new Map<string, EndpointConfig>();
  private readonly manager: EndpointManager;

  registerEndpoint(
    endpoint: Endpoint,
    config: EndpointConfig
  ): RegistrationResponse {
    const registration = this.processEndpointRegistration(endpoint, config);
    return this.generateRegistrationResponse(registration);
  }
}
