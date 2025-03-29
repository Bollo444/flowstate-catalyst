export const ProjectPlanner: React.FC = () => {
  const { projects, timelines } = useProjectPlanning();

  return (
    <div className="project-planner">
      <TimelineBuilder projects={projects} />
      <MilestoneManager timelines={timelines} />
      <DependencyMapper />
    </div>
  );
};
