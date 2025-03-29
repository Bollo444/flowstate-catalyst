export class SprintOrchestrator {
  private readonly sprintMetrics = new Map<string, SprintMetrics>();
  private readonly orchestrationEngine: OrchestrationEngine;

  orchestrateSprint(
    sprintGoals: SprintGoals,
    teamCapacity: TeamCapacity
  ): SprintPlan {
    const planning = this.calculateSprintPlanning(sprintGoals, teamCapacity);
    const schedule = this.createSprintSchedule(planning);

    return this.generateSprintPlan(schedule);
  }
}
