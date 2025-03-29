export class CoreActionHandler {
  private readonly handlers = new Map<string, ActionHandler>();
  private readonly engine: HandlerEngine;

  handleAction(action: CoreAction): ActionResult {
    const handled = this.processAction(action);
    return this.generateActionReport(handled);
  }
}
