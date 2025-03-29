import { NotificationManager } from "../../systems/notification/NotificationManager";

describe("Notification Tests", () => {
  test("Notification Operations", () => {
    const notification = new NotificationManager();
    expect(notification).toBeDefined();
    expect(notification.manageNotification).toBeDefined();
  });
});
