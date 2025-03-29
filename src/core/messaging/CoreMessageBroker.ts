export class CoreMessageBroker {
  private readonly messageQueue = new Map<string, CoreMessage>();
  private readonly broker: MessageBroker;

  brokerMessage(message: CoreMessage): BrokerResult {
    const brokered = this.routeMessage(message);
    return this.generateBrokerReport(brokered);
  }
}
