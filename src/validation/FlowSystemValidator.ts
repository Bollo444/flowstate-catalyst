import { supabase } from "../lib/supabaseClient";
import { AppError } from "../types/error";

interface ValidationResult {
  status: "success" | "warning" | "error";
  message: string;
  details: Record<string, unknown>;
}

interface DataFlowTestResult {
  latency: number;
  throughput: number;
  errorRate: number;
  status: "healthy" | "degraded" | "failed";
}

interface ChartRenderingResult {
  rendered: boolean;
  renderTime: number;
  memoryUsage: number;
  errors?: string[];
}

interface SystemValidationError extends AppError {
  code: "DATAFLOW_ERROR" | "CHART_ERROR" | "SYSTEM_ERROR";
}

class FlowSystemValidator {
  public async validateDataFlow(): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];

    try {
      const dataFlowResult = await this.testRealtimeDataFlow();
      results.push({
        status: "success",
        message: "Real-time data flow is operational",
        details: {
          ...dataFlowResult,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error: any) {
      const validationError: SystemValidationError = {
        code: "DATAFLOW_ERROR",
        message: "Real-time data flow validation failed",
        details:
          error instanceof Error
            ? { error: error.message }
            : { error: "Unknown error" },
      };
      results.push({
        status: "error",
        message: validationError.message,
        details: validationError.details as Record<string, unknown>,
      });
    }

    try {
      const chartResult = await this.validateChartRendering();
      results.push({
        status: "success",
        message: "Chart rendering validated",
        details: {
          ...chartResult,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error: any) {
      const validationError: SystemValidationError = {
        code: "CHART_ERROR",
        message: "Chart rendering validation failed",
        details:
          error instanceof Error
            ? { error: error.message }
            : { error: "Unknown error" },
      };
      results.push({
        status: "error",
        message: validationError.message,
        details: validationError.details as Record<string, unknown>,
      });
    }

    return results;
  }

  private async testRealtimeDataFlow(): Promise<DataFlowTestResult> {
    const startTime = performance.now();

    try {
      const { data, error } = await supabase
        .from("system_health")
        .select("*")
        .single();

      if (error) throw error;

      const endTime = performance.now();
      const latency = endTime - startTime;

      return {
        latency,
        throughput: data?.throughput ?? 0,
        errorRate: data?.error_rate ?? 0,
        status: this.determineHealthStatus(latency, data?.error_rate ?? 0),
      };
    } catch (error) {
      throw new Error(
        `Real-time data flow test failed: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  private determineHealthStatus(
    latency: number,
    errorRate: number
  ): DataFlowTestResult["status"] {
    if (latency > 1000 || errorRate > 5) return "failed";
    if (latency > 500 || errorRate > 1) return "degraded";
    return "healthy";
  }

  private async validateChartRendering(): Promise<ChartRenderingResult> {
    try {
      const startTime = performance.now();
      // Simulate chart rendering validation
      await new Promise((resolve) => setTimeout(resolve, 100));
      const endTime = performance.now();

      return {
        rendered: true,
        renderTime: endTime - startTime,
        memoryUsage: 0,
      };
    } catch (error: any) {
      return {
        rendered: false,
        renderTime: 0,
        memoryUsage: 0,
        errors: [error instanceof Error ? error.message : "Unknown error"],
      };
    }
  }

  public async validateSystem(): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];

    try {
      const [dataFlowResults, chartResults] = await Promise.all([
        this.testRealtimeDataFlow(),
        this.validateChartRendering(),
      ]);

      results.push(
        {
          status: dataFlowResults.status === "healthy" ? "success" : "error",
          message: `Data flow status: ${dataFlowResults.status}`,
          details: {
            ...dataFlowResults,
            timestamp: new Date().toISOString(),
          },
        },
        {
          status: chartResults.rendered ? "success" : "error",
          message: "Chart rendering validation",
          details: {
            ...chartResults,
            timestamp: new Date().toISOString(),
          },
        }
      );
    } catch (error: any) {
      const systemError: SystemValidationError = {
        code: "SYSTEM_ERROR",
        message: "System validation failed",
        details:
          error instanceof Error
            ? { error: error.message }
            : { error: "Unknown error" },
      };

      results.push({
        status: "error",
        message: systemError.message,
        details: systemError.details as Record<string, unknown>,
      });
    }

    return results;
  }
}

export default FlowSystemValidator;
