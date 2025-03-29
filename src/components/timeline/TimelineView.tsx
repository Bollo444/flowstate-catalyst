export const TimelineView: React.FC = () => {
  const { events, timeframe } = useTimeline();

  return (
    <div className="timeline-view">
      <TimelineChart events={events} />
      <TimelineControls timeframe={timeframe} />
      <EventDetails />
    </div>
  );
};
