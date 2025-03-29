export class CoreEventEmitter {
  private readonly emitters = new Map<string, EventHandler>();
  private readonly manager: EventManager;

  emitEvent(event: CoreEvent): EventResult {
    const emitted = this.processEvent(event);
    return this.generateEventReport(emitted);
  }
}
