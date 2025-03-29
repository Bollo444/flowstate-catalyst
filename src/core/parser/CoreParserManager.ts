export class CoreParserManager {
  private readonly parsers = new Map<string, ParserHandler>();
  private readonly manager: ParserManager;

  manageParser(request: ParserRequest): ParserResult {
    const managed = this.processParser(request);
    return this.generateParserReport(managed);
  }
}
