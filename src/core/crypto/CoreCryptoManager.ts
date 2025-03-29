export class CoreCryptoManager {
  private readonly cryptos = new Map<string, CryptoHandler>();
  private readonly manager: CryptoManager;

  manageCrypto(request: CryptoRequest): CryptoResult {
    const managed = this.processCrypto(request);
    return this.generateCryptoReport(managed);
  }
}
