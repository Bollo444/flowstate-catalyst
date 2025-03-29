export class ProjectFeedbackEngine {
  private readonly feedbackMetrics = new Map<string, FeedbackMetrics>();
  private readonly engine: FeedbackEngine;

  processFeedback(
    feedback: Feedback[],
    context: FeedbackContext
  ): FeedbackReport {
    const analysis = this.analyzeFeedbackPatterns(feedback, context);
    return this.generateFeedbackReport(analysis);
  }
}
