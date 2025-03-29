export const NotificationCenter: React.FC = () => {
  const { notifications, handleNotification } = useNotifications();

  return (
    <div className="notification-center">
      <NotificationList notifications={notifications} />
      <NotificationPreferences />
      <AlertSystem onNotify={handleNotification} />
    </div>
  );
};
