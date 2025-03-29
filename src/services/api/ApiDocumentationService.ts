export class ApiDocumentationService {
  private readonly docs = new Map<string, Documentation>();
  private readonly generator: DocGenerator;

  generateDocs(endpoints: Endpoint[]): DocumentationResult {
    const documentation = this.processEndpoints(endpoints);
    return this.generateDocumentation(documentation);
  }
}
