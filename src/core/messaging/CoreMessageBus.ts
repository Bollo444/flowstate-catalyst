export class CoreMessageBus {
  private readonly handlers = new Map<string, MessageHandler>();
  private readonly manager: MessageManager;

  handleMessage(message: CoreMessage): MessageResult {
    const handled = this.processMessage(message);
    return this.generateMessageReport(handled);
  }
}
