export class ServicePubSub {
  private readonly subscribers = new Map<string, Subscriber>();
  private readonly manager: PubSubManager;

  handleMessage(message: PubSubMessage): PubSubResult {
    const handled = this.processMessage(message);
    return this.generateMessageReport(handled);
  }
}
