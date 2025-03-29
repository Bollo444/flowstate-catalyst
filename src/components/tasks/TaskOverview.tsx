export const TaskOverview: React.FC = () => {
  const { tasks, updateTask } = useTasks();

  return (
    <div className="task-overview">
      <TaskList tasks={tasks} />
      <TaskFilters />
      <TaskStats />
      <TaskActions onUpdate={updateTask} />
    </div>
  );
};
