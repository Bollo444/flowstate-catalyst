export class CoreMiddlewareHandler {
  private readonly middleware = new Map<string, Middleware>();
  private readonly handler: MiddlewareHandler;

  processMiddleware(context: MiddlewareContext): MiddlewareResult {
    const processed = this.executeMiddleware(context);
    return this.generateMiddlewareReport(processed);
  }
}
