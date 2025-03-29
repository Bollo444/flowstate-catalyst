export class FlowAnalyzer {
  private static readonly PATTERN_WINDOW = 7; // days
  private static readonly CONFIDENCE_THRESHOLD = 0.75;

  static detectPatterns(flowData: FlowDataPoint[]): FlowPattern[] {
    const patterns: FlowPattern[] = [];
    const timeBlocks = this.groupByTimeBlock(flowData);

    // Detect daily patterns
    patterns.push(...this.findDailyPatterns(timeBlocks));

    // Detect activity patterns
    patterns.push(...this.findActivityPatterns(flowData));

    // Detect correlation patterns
    patterns.push(...this.findCorrelations(flowData));

    return patterns.filter((p) => p.confidence >= this.CONFIDENCE_THRESHOLD);
  }

  static generateInsights(
    patterns: FlowPattern[],
    currentState: FlowState
  ): FlowInsight[] {
    return patterns.map((pattern) => ({
      id: generateUUID(),
      type: this.determineInsightType(pattern),
      description: this.generateInsightDescription(pattern),
      relevance: this.calculateRelevance(pattern, currentState),
      actionable: this.isActionable(pattern),
      suggestedActions: this.generateActions(pattern),
    }));
  }

  private static groupByTimeBlock(data: FlowDataPoint[]): TimeBlockData[] {
    return data.reduce((blocks, point) => {
      const blockKey = this.getTimeBlockKey(point.timestamp);
      const existing = blocks.find((b) => b.key === blockKey);

      if (existing) {
        existing.points.push(point);
      } else {
        blocks.push({ key: blockKey, points: [point] });
      }

      return blocks;
    }, [] as TimeBlockData[]);
  }

  private static findDailyPatterns(timeBlocks: TimeBlockData[]): FlowPattern[] {
    const patterns: FlowPattern[] = [];

    timeBlocks.forEach((block) => {
      const avgScore = this.calculateAverageScore(block.points);
      const consistency = this.calculateConsistency(block.points);

      if (consistency > 0.7) {
        patterns.push({
          type: "daily",
          timeBlock: block.key,
          averageScore: avgScore,
          confidence: consistency,
          description: this.generatePatternDescription("daily", block),
        });
      }
    });

    return patterns;
  }

  private static findActivityPatterns(data: FlowDataPoint[]): FlowPattern[] {
    const activityGroups = this.groupByActivity(data);
    return Object.entries(activityGroups).map(([activity, points]) => ({
      type: "activity",
      activity,
      averageScore: this.calculateAverageScore(points),
      confidence: this.calculateConfidence(points),
      description: this.generatePatternDescription("activity", {
        activity,
        points,
      }),
    }));
  }
}
