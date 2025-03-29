export class ProjectTransformationEngine {
  private readonly transformationMetrics = new Map<
    string,
    TransformationMetrics
  >();
  private readonly engine: TransformationEngine;

  manageTransformation(
    project: Project,
    goals: TransformationGoals
  ): TransformationPlan {
    const strategy = this.developTransformationStrategy(project, goals);
    return this.generateTransformationPlan(strategy);
  }
}
