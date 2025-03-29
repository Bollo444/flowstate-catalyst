export const Scheduler: React.FC<SchedulerProps> = ({ events, view }) => {
  return (
    <div className="scheduler-container">
      <TimeGrid events={events} />
      <ViewSelector view={view} />
      <EventEditor />
    </div>
  );
};
