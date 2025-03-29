export class CoreSerializationManager {
  private readonly serializers = new Map<string, SerializationHandler>();
  private readonly manager: SerializationManager;

  manageSerialization(request: SerializationRequest): SerializationResult {
    const managed = this.processSerialization(request);
    return this.generateSerializationReport(managed);
  }
}
