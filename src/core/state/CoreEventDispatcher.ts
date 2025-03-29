export class CoreEventDispatcher {
  private readonly eventQueue = new Map<string, CoreEvent>();
  private readonly dispatcher: EventDispatcher;

  dispatchEvent(event: CoreEvent): EventResult {
    const processed = this.processEvent(event);
    return this.broadcastEvent(processed);
  }
}
