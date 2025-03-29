export class CoreEncryptionManager {
  private readonly encryptors = new Map<string, EncryptionHandler>();
  private readonly manager: EncryptionManager;

  manageEncryption(request: EncryptionRequest): EncryptionResult {
    const managed = this.processEncryption(request);
    return this.generateEncryptionReport(managed);
  }
}
