export const TaskPrioritizer: React.FC = () => {
  const { tasks, priorities } = useTaskPriority();

  return (
    <div className="task-prioritizer">
      <PriorityMatrix tasks={tasks} />
      <PriorityControls priorities={priorities} />
      <AutoSuggestions />
    </div>
  );
};
