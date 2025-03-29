export class ServiceQueueManager {
  private readonly queues = new Map<string, QueueHandler>();
  private readonly manager: QueueManager;

  manageQueue(request: QueueRequest): QueueResult {
    const queued = this.processQueue(request);
    return this.generateQueueReport(queued);
  }
}
