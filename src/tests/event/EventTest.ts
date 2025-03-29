import { EventManager } from "../../systems/event/EventManager";

describe("Event Tests", () => {
  test("Event Operations", () => {
    const event = new EventManager();
    expect(event).toBeDefined();
    expect(event.manageEvent).toBeDefined();
  });
});
