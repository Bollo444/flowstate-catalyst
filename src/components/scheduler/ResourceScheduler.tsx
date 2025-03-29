export const ResourceScheduler: React.FC = () => {
  const { schedule, resources } = useScheduler();

  return (
    <div className="resource-scheduler">
      <ScheduleGrid schedule={schedule} />
      <ResourceAllocation resources={resources} />
      <ConflictResolver />
    </div>
  );
};
