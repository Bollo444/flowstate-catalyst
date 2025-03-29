export class ServiceContractManager {
  private readonly contracts = new Map<string, ContractHandler>();
  private readonly manager: ContractManager;

  manageContract(request: ContractRequest): ContractResult {
    const managed = this.processContract(request);
    return this.generateContractReport(managed);
  }
}
