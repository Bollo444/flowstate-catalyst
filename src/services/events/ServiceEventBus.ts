export class ServiceEventBus {
  private readonly handlers = new Map<string, EventHandler>();
  private readonly manager: EventManager;

  handleEvent(event: ServiceEvent): EventResult {
    const handled = this.processEvent(event);
    return this.generateEventReport(handled);
  }
}
