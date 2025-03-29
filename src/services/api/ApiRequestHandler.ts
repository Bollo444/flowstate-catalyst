export class ApiRequestHandler {
  private readonly requestQueue = new Map<string, RequestData>();
  private readonly handler: RequestHandler;

  handleRequest(request: ApiRequest): ApiResponse {
    const processed = this.processRequest(request);
    return this.generateResponse(processed);
  }
}
