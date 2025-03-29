export class CoreQueueManager {
  private readonly queues = new Map<string, QueueHandler>();
  private readonly manager: QueueManager;

  manageQueue(request: QueueRequest): QueueResult {
    const managed = this.processQueue(request);
    return this.generateQueueReport(managed);
  }
}
