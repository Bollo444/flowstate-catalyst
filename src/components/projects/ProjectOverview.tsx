export const ProjectOverview: React.FC = () => {
  const { projects, activeProject } = useProjects();

  return (
    <div className="project-overview">
      <ProjectList projects={projects} />
      <ProjectDetails project={activeProject} />
      <ProjectMetrics />
    </div>
  );
};
