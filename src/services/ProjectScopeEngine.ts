export class ProjectScopeEngine {
  private readonly scopeMetrics = new Map<string, ScopeMetrics>();
  private readonly engine: ScopeEngine;

  manageScope(project: Project, boundaries: ScopeBoundaries): ScopePlan {
    const analysis = this.analyzeScopeChanges(project, boundaries);
    return this.generateScopePlan(analysis);
  }
}
