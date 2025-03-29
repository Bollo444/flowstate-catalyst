export class DataQueueManager {
  private readonly queues = new Map<string, DataQueue>();
  private readonly manager: QueueManager;

  manageQueue(data: QueueableData): QueueResult {
    const queued = this.processQueue(data);
    return this.generateQueueReport(queued);
  }
}
