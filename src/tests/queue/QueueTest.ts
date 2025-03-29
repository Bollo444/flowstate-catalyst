import { QueueManager } from "../../systems/queue/QueueManager";

describe("Queue Tests", () => {
  test("Queue Operations", () => {
    const queue = new QueueManager();
    expect(queue).toBeDefined();
    expect(queue.manageQueue).toBeDefined();
  });
});
