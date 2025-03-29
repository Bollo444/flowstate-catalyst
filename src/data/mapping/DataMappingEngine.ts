export class DataMappingEngine {
  private readonly mappers = new Map<string, DataMapper>();
  private readonly engine: MappingEngine;

  mapData(data: MappableData): MappingResult {
    const mapped = this.processMapping(data);
    return this.generateMappingReport(mapped);
  }
}
