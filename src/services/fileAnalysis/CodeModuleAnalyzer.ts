export class CodeModuleAnalyzer {
  private readonly moduleMetrics = new Map<string, ModuleMetric>();
  private readonly analyzer: ModuleEngine;

  analyzeModules(modules: CodeModule[]): ModuleReport {
    const analysis = this.assessModules(modules);
    return this.generateModuleReport(analysis);
  }
}
