export const Notification: React.FC<NotificationProps> = ({
  type,
  message,
  duration,
}) => {
  return (
    <div className={`notification-${type}`}>
      <NotificationIcon type={type} />
      <NotificationMessage message={message} />
      <NotificationTimer duration={duration} />
    </div>
  );
};
