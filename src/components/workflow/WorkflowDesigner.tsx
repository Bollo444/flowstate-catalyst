export const WorkflowDesigner: React.FC = () => {
  const { workflows, updateWorkflow } = useWorkflows();

  return (
    <div className="workflow-designer">
      <WorkflowCanvas workflows={workflows} />
      <WorkflowTools onUpdate={updateWorkflow} />
      <WorkflowValidation />
    </div>
  );
};
