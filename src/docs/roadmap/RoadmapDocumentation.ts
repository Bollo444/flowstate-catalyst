export class RoadmapDocumentation {
  private readonly milestones = new Map<string, RoadmapDoc>();
  private readonly generator: DocGenerator;

  generateRoadmapDoc(config: DocConfig): DocResult {
    const generated = this.processRoadmap(config);
    return this.generateDocReport(generated);
  }
}
