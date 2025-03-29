export class ProjectSustainabilityEngine {
  private readonly sustainabilityMetrics = new Map<
    string,
    SustainabilityMetrics
  >();
  private readonly engine: SustainabilityEngine;

  ensureSustainability(
    project: Project,
    criteria: SustainabilityCriteria
  ): SustainabilityPlan {
    const assessment = this.assessSustainability(project, criteria);
    return this.generateSustainabilityPlan(assessment);
  }
}
