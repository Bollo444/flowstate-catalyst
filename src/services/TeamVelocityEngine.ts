export class TeamVelocityEngine {
  private readonly velocityMetrics = new Map<string, VelocityMetrics>();
  private readonly engine: VelocityEngine;

  calculateVelocity(team: Team, sprints: Sprint[]): VelocityReport {
    const velocity = this.analyzeTeamVelocity(team, sprints);
    return this.generateVelocityReport(velocity);
  }
}
