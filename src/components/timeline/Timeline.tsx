export const Timeline: React.FC<TimelineProps> = ({ events, orientation }) => {
  return (
    <div className={`timeline-${orientation}`}>
      <TimelineItems events={events} />
      <TimelineConnectors />
    </div>
  );
};
