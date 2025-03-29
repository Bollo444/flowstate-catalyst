// src/monitoring/FlowPerformanceMonitor.ts

export class FlowPerformanceMonitor {
  private static instance: FlowPerformanceMonitor;
  private metrics: Map<string, number[]> = new Map();
  private thresholds: Map<string, number> = new Map();

  private constructor() {
    this.thresholds.set("renderTime", 16); // 60fps target
    this.thresholds.set("taskUpdateLatency", 100);
    this.thresholds.set("flowStateUpdateInterval", 1000);
  }

  static getInstance(): FlowPerformanceMonitor {
    if (!FlowPerformanceMonitor.instance) {
      FlowPerformanceMonitor.instance = new FlowPerformanceMonitor();
    }
    return FlowPerformanceMonitor.instance;
  }

  measureOperation(name: string, startTime: number): void {
    const duration = performance.now() - startTime;
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    this.metrics.get(name)?.push(duration);
    this.checkThreshold(name, duration);
  }

  private checkThreshold(name: string, duration: number): void {
    const threshold = this.thresholds.get(name);
    if (threshold && duration > threshold) {
      console.warn(
        `Performance warning: ${name} took ${duration}ms (threshold: ${threshold}ms)`
      );
      // Could integrate with your monitoring service here
    }
  }

  getMetrics(): Record<string, { average: number; max: number; min: number }> {
    const result: Record<
      string,
      { average: number; max: number; min: number }
    > = {};

    this.metrics.forEach((durations, name) => {
      result[name] = {
        average: durations.reduce((a, b) => a + b, 0) / durations.length,
        max: Math.max(...durations),
        min: Math.min(...durations),
      };
    });

    return result;
  }
}
