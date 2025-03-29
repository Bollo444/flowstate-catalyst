export class DependencyAnalyzer {
  private readonly dependencies = new Map<string, Dependency>();
  private readonly analyzer: DependencyEngine;

  analyzeDependencies(files: ProjectFile[]): DependencyGraph {
    const dependencies = this.mapDependencies(files);
    return this.generateDependencyGraph(dependencies);
  }
}
