export class TaskScheduler {
  private readonly energyMap: Map<string, number> = new Map();
  private readonly contextSwitchCosts: Map<string, number> = new Map();

  scheduleOptimalSequence(
    tasks: Task[],
    flowState: FlowState,
    timeAvailable: number
  ): ScheduledTask[] {
    const energyLevels = this.calculateEnergyLevels(flowState);
    const sortedTasks = this.prioritizeTasks(tasks, energyLevels);

    return this.createOptimalSchedule(sortedTasks, timeAvailable);
  }

  private calculateEnergyLevels(flowState: FlowState): EnergyLevels {
    return {
      creative: flowState.score * 1.2,
      analytical: flowState.score * 0.8,
      routine: Math.max(60, flowState.score * 0.6),
    };
  }

  private prioritizeTasks(tasks: Task[], energy: EnergyLevels): Task[] {
    return tasks.sort((a, b) => {
      const scoreA = this.calculateTaskPriority(a, energy);
      const scoreB = this.calculateTaskPriority(b, energy);
      return scoreB - scoreA;
    });
  }

  private createOptimalSchedule(
    tasks: Task[],
    timeAvailable: number
  ): ScheduledTask[] {
    let currentTime = 0;
    const schedule: ScheduledTask[] = [];

    for (const task of tasks) {
      if (currentTime + task.estimatedDuration > timeAvailable) continue;

      schedule.push({
        ...task,
        startTime: currentTime,
        endTime: currentTime + task.estimatedDuration,
        predictedEnergy: this.predictTaskEnergy(task, currentTime),
      });

      currentTime += task.estimatedDuration;
    }

    return schedule;
  }
}
